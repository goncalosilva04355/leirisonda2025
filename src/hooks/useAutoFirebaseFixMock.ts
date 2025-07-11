// Mock simples para useAutoFirebaseFix
export const useAutoFirebaseFix = () => {
  console.log("🔧 useAutoFirebaseFix - modo mock");

  return {
    isFixing: false,
    lastFix: null,
    fixCount: 0,
    performFix: () => Promise.resolve(),
    checkOnUserAction: () => Promise.resolve(),
    autoFixEnabled: false,
    toggleAutoFix: () => {},
  };
};

export default useAutoFirebaseFix;
