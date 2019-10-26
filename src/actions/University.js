import { ReduxActions } from "../constants";
import { Axios } from ".";
import qs from "qs";

const PopulateUniversities = UniversitiesJson => async dispatch => {
  const Universities = UniversitiesJson.sort((a, b) => a.name.localeCompare(b.name)).map((e, i) => {
    let { web_pages, name, alpha_two_code, domains, country } = e;
    web_pages = web_pages[0];
    domains = domains[0];
    return {
      pk: i + 1,
      model: "university.university",
      fields: { website: web_pages, name, alpha_two_code, domain: domains, country }
    };
  });
  console.log(JSON.stringify(Universities));
};

const CreateUniversity = payload => async dispatch =>
  await Axios()
    .post("universities/", qs.stringify(payload))
    .then(async res => console.log("University created: ", res.data))
    .catch(e => console.log("CreateUniversity: ", e.response));

export { PopulateUniversities, CreateUniversity };
