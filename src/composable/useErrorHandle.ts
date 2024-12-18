import { toast } from 'vue3-toastify';

export function useErrorHandle() {
  function show(error) {
    let msg;
    const errorResponse = error?.response;
    const errorData = errorResponse?.data;
    const errorStatus = errorResponse?.status;

    if (errorStatus < 400) {
      return;
    }

    if (errorStatus === 422 && errorData?.errors) {
      msg = Object.values(errorData.errors).flat().join("\n");
    }

    toast.error(msg ?? errorData?.message ?? error.message);

    console.error(error);
  }

  return { show };
}
