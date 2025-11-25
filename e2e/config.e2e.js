module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/scout.app',
      build: 'xcodebuild -workspace ios/scout.xcworkspace -scheme scout -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  configurations: {
    'ios.sim.release': {
      device: {
        type: 'iPhone 15',
      },
      app: 'ios',
    },
  },
  testRunner: 'jest',
};
