return () => {
      authPromise
        .then((unsubscribe) => {
          if (unsubscribe && typeof unsubscribe === "function") {
            unsubscribe();
          }
        })
        .catch(console.error);
    };
  }, []);