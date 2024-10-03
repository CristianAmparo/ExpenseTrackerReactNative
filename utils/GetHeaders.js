export const GetHeaders = () => {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const token = storedData?.token;

  if (!token) {
    console.log("Token is missing");
    // You might want to handle this case more gracefully, depending on your application requirements.
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};
