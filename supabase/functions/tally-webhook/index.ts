import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Tally Webhook Handler
 * Processes gym verification form submissions from Tally forms
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    console.log('Tally webhook received:', payload);

    // Extract form data from Tally webhook
    const { eventType, data } = payload;

    if (eventType !== 'FORM_RESPONSE') {
      return new Response(
        JSON.stringify({ message: 'Event type not supported' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Parse form fields
    const fields = data.fields.reduce((acc: any, field: any) => {
      acc[field.key] = field.value;
      return acc;
    }, {});

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Determine form type and process accordingly
    const formId = data.formId;

    if (formId === Deno.env.get('TALLY_GYM_VERIFICATION_FORM_ID')) {
      // Gym Verification Form
      await processGymVerification(supabase, fields, data);
    } else if (formId === Deno.env.get('TALLY_PARTNER_APPLICATION_FORM_ID')) {
      // Partner Application Form
      await processPartnerApplication(supabase, fields, data);
    } else if (formId === Deno.env.get('TALLY_GYM_CLAIM_FORM_ID')) {
      // Gym Claim Form
      await processGymClaim(supabase, fields, data);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing Tally webhook:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to process webhook',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function processGymVerification(supabase: any, fields: any, data: any) {
  // Extract gym information
  const gymData = {
    name: fields.gym_name,
    address: fields.address,
    city: fields.city,
    state: fields.state,
    zip_code: fields.zip_code,
    phone: fields.phone,
    email: fields.email,
    website: fields.website,
    description: fields.description,
    amenities: fields.amenities ? fields.amenities.split(',').map((a: string) => a.trim()) : [],
    day_pass_price: parseFloat(fields.day_pass_price) || null,
    week_pass_price: parseFloat(fields.week_pass_price) || null,
    month_pass_price: parseFloat(fields.month_pass_price) || null,
    photos: fields.photos || [],
    verification_status: 'pending',
    data_source: 'gym_owner_verification',
    verification_submitted_at: new Date().toISOString(),
    tally_response_id: data.responseId,
  };

  // Check if gym already exists
  const { data: existingGym, error: findError } = await supabase
    .from('gyms')
    .select('id')
    .eq('name', gymData.name)
    .eq('address', gymData.address)
    .single();

  if (existingGym) {
    // Update existing gym
    await supabase
      .from('gyms')
      .update({
        ...gymData,
        is_verified: false, // Needs admin approval
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingGym.id);

    console.log('Updated existing gym:', existingGym.id);
  } else {
    // Create new gym
    const { data: newGym, error: insertError } = await supabase
      .from('gyms')
      .insert(gymData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating gym:', insertError);
      throw insertError;
    }

    console.log('Created new gym:', newGym.id);
  }

  // Create verification request for admin review
  await supabase.from('verification_requests').insert({
    type: 'gym_verification',
    status: 'pending',
    form_data: fields,
    tally_response_id: data.responseId,
    submitted_at: new Date().toISOString(),
  });
}

async function processPartnerApplication(supabase: any, fields: any, data: any) {
  // Create partner application
  const applicationData = {
    gym_name: fields.gym_name,
    contact_name: fields.contact_name,
    contact_email: fields.contact_email,
    contact_phone: fields.contact_phone,
    address: fields.address,
    website: fields.website,
    description: fields.description,
    why_partner: fields.why_partner,
    status: 'pending',
    tally_response_id: data.responseId,
    submitted_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('partner_applications')
    .insert(applicationData);

  if (error) {
    console.error('Error creating partner application:', error);
    throw error;
  }

  console.log('Created partner application');

  // Send notification to admin
  // TODO: Implement admin notification
}

async function processGymClaim(supabase: any, fields: any, data: any) {
  // Create gym claim request
  const claimData = {
    gym_id: fields.gym_id,
    claimant_name: fields.claimant_name,
    claimant_email: fields.claimant_email,
    claimant_phone: fields.claimant_phone,
    relationship: fields.relationship, // owner, manager, staff
    proof_of_ownership: fields.proof_documents,
    status: 'pending',
    tally_response_id: data.responseId,
    submitted_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('gym_claims')
    .insert(claimData);

  if (error) {
    console.error('Error creating gym claim:', error);
    throw error;
  }

  console.log('Created gym claim');

  // Send notification to admin
  // TODO: Implement admin notification
}
