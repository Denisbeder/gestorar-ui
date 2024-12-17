import { toast } from 'vue3-toastify';

export function useErrorHandle() {
  function show(error) {
    let msg;

    if (error.response.status === 422 && error.response.data?.errors) {
      msg = Object.values(error.response.data.errors).flat().join("\n");
    }

    toast.error(msg ?? error.response.data.message ?? error.message);

    console.error(error);
  }

  return { show };
}
