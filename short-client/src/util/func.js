export const isHandleable = (err) => {
    const bool = (err && err.response && err.response.data);
    return bool!== undefined
  };
  