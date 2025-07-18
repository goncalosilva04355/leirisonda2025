import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.leirisonda.production",
  appName: "Leirisonda",
  webDir: "dist-production",
  server: {
    androidScheme: "https",
    hostname: "leirisonda.app",
    iosScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0891b2",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0891b2",
      overlaysWebView: false,
    },
    App: {
      disallowOverscroll: true,
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
  },
  ios: {
    scheme: "Leirisonda",
    webContentsDebuggingEnabled: false, // Desabilitar em produção
    minVersion: "13.0",
    backgroundColor: "#0891b2",
    allowsLinkPreview: false,
    handleApplicationURL: true,
  },
  android: {
    minWebView: "60.0.0",
    backgroundColor: "#0891b2",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // Desabilitar em produção
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: "AAB", // Android App Bundle para produção
      signingType: "apksigner",
    },
  },
  bundledWebRuntime: false, // Usar runtime do dispositivo para melhor performance
};

export default config;
