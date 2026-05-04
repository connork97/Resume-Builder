import { fetchApi } from "@/lib/fetch";

export const addUserToApi = async (newUserData) => {
   try {
      const data = await fetchApi({
         endpoint: '/signup',
         options: {
            method: 'POST',
            body: JSON.stringify(newUserData)
         }
      })

      return data;

   } catch (error) {
      console.error('Error adding new user: ', error);
      alert(
         error?.code && error?.message
         ? error.code + '\n' + error.message
         : 'Error adding new user.'
      )

      return null;
   }
}

export const logUserInApi = async (userCredentials) => {
   try {
      const data = await fetchApi({
         endpoint: '/login',
         options: {
            method: 'POST',
            body: JSON.stringify(userCredentials)
         }
      })

      return data;

   } catch (error) {
      console.error('Error logging user in: ', error);
      alert(
         error?.code && error?.message
         ? error.code + '\n' + error.message
         : 'Error logging user in.'
      )

      return null;
   }
}

export const logUserOutOfApi = async () => {
   try {
      await fetchApi({
         endpoint: '/logout',
         options: { method: 'DELETE' }
      })

      return true;
   } catch (error) {
      console.error('Error logging user out: ', error);
      alert(
         error?.code && error?.message
         ? error.code + '\n' + error.message
         : 'Error logging user out.'
      )
      return false;
   }
}

export const updateUserApi = async (userId, userData) => {
   try {
      const data = await fetchApi({
         endpoint: `/users/${userId}`,
         options: {
            method: 'PUT',
            body: JSON.stringify(userData)
         }
      })

      return data;

   } catch (error) {
      console.error(`Error updating user of ID ${userId}: `, error);
      alert(
         error?.code && error?.message
         ? error.code + '\n' + error.message
         : `Error updating user of ID ${userId}.`
      )

      return null;
   }
}

export const getUserResumesFromApi = async (userId) => {
   try {
      const data = await fetchApi({
         endpoint: `/users/${userId}`
      })
      return data;
   } catch (error) {
      console.error(`Error fetching resumes for user of ID ${userId}: `, error);
      alert(
         error?.code && error?.message
         ? error.code + '\n' + error.message
         : `Error fetching resumes for user of ID ${userId}.`
      )

      return null;
   }
}