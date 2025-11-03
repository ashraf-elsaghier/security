import axios from "axios";

// fetch all  Completed Users(main page)
export const fetchAllAssignUsers = async () => {
    const response = await axios({
        method: "get",
        url: `dashboard/management/users`,
    });
    return response.data;
};