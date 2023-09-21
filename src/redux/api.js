import axios from "axios";

export const fetchDataSuccess = (data) => ({
  type: "FETCH_DATA_SUCCESS",
  payload: data,
});

export const fetchDataError = (error) => ({
  type: "FETCH_DATA_ERROR",
  payload: error,
});

export const fetchContactData = ({ companyId, page, query, countryId }) => {
  return (dispatch) => {
    const headers = {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjU2MCwiZXhwIjoxNzI2NTY3MTc5LCJ0eXBlIjoiYWNjZXNzIiwidGltZXN0YW1wIjoxNjk1MDMxMTc5fQ.0y7NtuVDCvcPvmWbliMs1q02sov2oFC6u2Hi6H4A2W4",
    };
    const url = `https://api.dev.pastorsline.com/api/contacts.json?companyId=${companyId}&page=${page}&query=${query}&countryId=${countryId}`;

    return axios
      .get(url, { headers })
      .then((response) => {
        dispatch(fetchDataSuccess(response.data));
        return response;
      })
      .catch((error) => {
        dispatch(fetchDataError(error));
        throw error;
      });
  };
};
