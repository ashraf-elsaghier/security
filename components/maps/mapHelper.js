export const syncLocaldata = (nameOfLocalData = "uservehs", uservehs) => {
  localStorage.removeItem(nameOfLocalData);
  localStorage.setItem(nameOfLocalData, uservehs);
};

export const getmainbuttons = (locinfo) => {
  return (
    <div>
      <button className="btn btn-primary w-100">
        Hello {locinfo.DisplayName}
      </button>
    </div>
  );
};
