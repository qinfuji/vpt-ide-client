import axios from 'axios';

export async function select(id: string) {
  let url = `/projects/selected/${id}`;
  try {
    let result = await axios.get(url);
    return result.data;
  } catch (error) {
    throw error;
  }
}
