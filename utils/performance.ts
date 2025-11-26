/**
 * Performance Monitoring Utilities
 *
 * Provides utilities for tracking app performance metrics including:
 * - Screen load times
 * - API call durations
 * - Component render times
 * - Memory usage
 */

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Enable performance monitoring only in development and staging
    this.enabled = __DEV__ || process.env.NODE_ENV === 'staging';
  }

  /**
   * Start tracking a performance metric
   */
  startTrace(name: string, metadata?: Record<string, any>): void {
    if (!this.enabled) return;

    this.metrics.set(name, {
      name,
      startTime: Date.now(),
      metadata,
    });
  }

  /**
   * Stop tracking a performance metric and log results
   */
  stopTrace(name: string): number | null {
    if (!this.enabled) return null;

    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance trace '${name}' was never started`);
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Log the metric
    this.logMetric(metric);

    // TODO: Send to analytics service
    // this.sendToAnalytics(metric);

    // Clean up
    this.metrics.delete(name);

    return duration;
  }

  /**
   * Measure an async operation
   */
  async measure<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTrace(name, metadata);
    try {
      const result = await operation();
      this.stopTrace(name);
      return result;
    } catch (error) {
      this.stopTrace(name);
      throw error;
    }
  }

  /**
   * Measure a synchronous operation
   */
  measureSync<T>(
    name: string,
    operation: () => T,
    metadata?: Record<string, any>
  ): T {
    this.startTrace(name, metadata);
    try {
      const result = operation();
      this.stopTrace(name);
      return result;
    } catch (error) {
      this.stopTrace(name);
      throw error;
    }
  }

  /**
   * Log metric to console
   */
  private logMetric(metric: PerformanceMetric): void {
    const color = this.getColorForDuration(metric.duration || 0);

    console.log(
      `%c[Performance] ${metric.name}: ${metric.duration}ms`,
      `color: ${color}; font-weight: bold;`,
      metric.metadata || ''
    );

    // Warn if operation is slow
    if (metric.duration && metric.duration > 1000) {
      console.warn(
        `⚠️  Slow operation detected: ${metric.name} took ${metric.duration}ms`
      );
    }
  }

  /**
   * Get color based on duration
   */
  private getColorForDuration(duration: number): string {
    if (duration < 100) return '#4CAF50'; // Green
    if (duration < 500) return '#FF9800'; // Orange
    return '#F44336'; // Red
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for measuring component render performance
 */
export const usePerformanceTrace = (
  componentName: string,
  metadata?: Record<string, any>
) => {
  const traceName = `Component:${componentName}`;

  // Start trace on mount
  React.useEffect(() => {
    performanceMonitor.startTrace(traceName, metadata);

    // Stop trace on unmount
    return () => {
      performanceMonitor.stopTrace(traceName);
    };
  }, [traceName]);
};

/**
 * Decorator for measuring method performance
 */
export function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const traceName = `${target.constructor.name}.${propertyKey}`;
    performanceMonitor.startTrace(traceName);

    try {
      const result = await originalMethod.apply(this, args);
      performanceMonitor.stopTrace(traceName);
      return result;
    } catch (error) {
      performanceMonitor.stopTrace(traceName);
      throw error;
    }
  };

  return descriptor;
}

/**
 * Track screen navigation performance
 */
export const trackScreenLoad = (screenName: string) => {
  const traceName = `Screen:${screenName}`;
  performanceMonitor.startTrace(traceName);

  // Return function to stop tracking
  return () => performanceMonitor.stopTrace(traceName);
};

/**
 * Track API call performance
 */
export const trackAPICall = async <T,>(
  endpoint: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.measure(`API:${endpoint}`, apiCall);
};

/**
 * Track database query performance
 */
export const trackDatabaseQuery = async <T,>(
  queryName: string,
  query: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.measure(`DB:${queryName}`, query);
};

/**
 * Get memory usage (React Native specific)
 */
export const getMemoryUsage = (): { jsHeapSizeLimit?: number; totalJSHeapSize?: number; usedJSHeapSize?: number } => {
  // @ts-ignore - performance.memory is not in types but exists in some environments
  if (typeof performance !== 'undefined' && performance.memory) {
    // @ts-ignore
    return performance.memory;
  }
  return {};
};

/**
 * Log memory usage
 */
export const logMemoryUsage = (): void => {
  const memory = getMemoryUsage();
  if (memory.usedJSHeapSize && memory.jsHeapSizeLimit) {
    const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
    const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
    const percentage = ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2);

    console.log(
      `%c[Memory] ${usedMB}MB / ${limitMB}MB (${percentage}%)`,
      'color: #2196F3; font-weight: bold;'
    );
  }
};

import React from 'react';
