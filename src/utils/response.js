function success(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, data });
}

function error(res, message = 'Internal Server Error', code = 500) {
  return res.status(code).json({ success: false, message });
}

module.exports = { success, error };
