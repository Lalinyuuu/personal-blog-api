export const ok = (res, data, status = 200) =>
    res.status(status).json({ ok: true, data });
  
  export const fail = (res, error) =>
    res.status(error.status || 500).json({ ok: false, error: error.message || "Server error" });
  
  export const asyncHandler = (fn) => (req, res) =>
    Promise.resolve(fn(req, res)).catch((err) => fail(res, err));