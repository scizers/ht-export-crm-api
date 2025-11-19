export function success(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function error(res, message = 'Internal Server Error', code = 500) {
  return res.status(code).json({ success: false, message });
}

export const successObj = {
  success: true,
  error: false,
};

export const errorObj = {
  success: false,
  error: true,
};
