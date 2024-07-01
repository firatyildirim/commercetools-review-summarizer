function queryProjectSettings() {
  return;
  const projectSettingsQuery = `
        query {
            project {
                name
                languages
                currencies
                countries
                version
                createdAt
            }
        }
    `;
}
