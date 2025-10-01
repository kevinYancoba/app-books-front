export const API_CONFIG = {
  baseUrl: 'http://localhost:8000/api',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      codeReset: '/auth/codeReset',
      updatePassword: '/auth/updatePassword'
    },
    plan: {
      createPlan: '/plan/createPlan',
      getUserPlans: '/plan/user',
      getPlan: '/plan',
      updatePlan: '/plan',
      deletePlan: '/plan'
    }
  }
};

export const HTTP_CONFIG = {
  timeout: 30000,
  retries: 3
};
