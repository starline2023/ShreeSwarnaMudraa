import { useDispatch, useSelector } from "react-redux";
import { GLOBALS } from "./GLOBALS";
import { logoutAction } from "../src/redux/action";
const { webServices, TerminalServices } = GLOBALS;

export const getAPI = async (endpoint) => {
  return await fetch(`${webServices}/${endpoint}`, {
    method: "GET",
    headers: { "Content-Type": "application/json;charset=utf-8" },
  })
    .then((response) => {
      return response.json();
    })
    .catch((e) => {
      console.log(`${endpoint} getAPI Error : `, e);
      return;
    });
};

export const postAPI = async (endpoint, body) => {
  return await fetch(`${webServices}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json;charset=utf-8" },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .catch((e) => {
      console.log(`${endpoint} postAPI Error : `, e);
      return;
    });
};

export const getAPI_Terminal = () => {
  const dispatch = useDispatch();
  const Token = useSelector((store) => store.user?.userDetails?.Data?.token);
  const getResponse = async (endpoint) => {
    return await fetch(`${TerminalServices}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${Token}`,
      },
    })
      .then((response) => {
        if (response.status == 401) {
          dispatch(logoutAction());
        }
        return response.json();
      })
      .catch((e) => {
        console.log(`${endpoint} getAPI_Terminal Error : `, e);
        return;
      });
  };
  return getResponse;
};
export const postAPI_Terminal = () => {
  const dispatch = useDispatch();
  const Token = useSelector((store) => store.user?.userDetails?.Data?.token);
  const getResponse = async (endpoint, body) => {
    return await fetch(`${TerminalServices}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status == 401) {
          dispatch(logoutAction());
        }
        return response.json();
      })
      .catch((e) => {
        console.log(`${endpoint} postAPI_Terminal Error : `, e);
        return;
      });
  };
  return getResponse;
};
export const putAPI_Terminal = () => {
  const dispatch = useDispatch();
  const Token = useSelector((store) => store.user?.userDetails?.Data?.token);
  const getResponse = async (endpoint, body) => {
    return await fetch(`${TerminalServices}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status == 401) {
          dispatch(logoutAction());
        }
        return response.json();
      })
      .catch((e) => {
        console.log(`${endpoint} putAPI_Terminal Error : `, e);
        return;
      });
  };
  return getResponse;
};
export const deleteAPI_Terminal = () => {
  const dispatch = useDispatch();
  const Token = useSelector((store) => store.user?.userDetails?.Data?.token);
  const getResponse = async (endpoint, body) => {
    return await fetch(`${TerminalServices}/${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: `Bearer ${Token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status == 401) {
          dispatch(logoutAction());
        }
        return response.json();
      })
      .catch((e) => {
        console.log(`${endpoint} deleteAPI_Terminal Error : `, e);
        return;
      });
  };
  return getResponse;
};
