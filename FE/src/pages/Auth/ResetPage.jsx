import React, { useState } from 'react';
import ResetPassword from './ResetPassword';
import Recovered from './Recovered'; // ✅ Lưu ý không có `{}` nếu là export default

export default function ResetPage() {
  const [page, setPage] = useState('reset');

  return (
    <>
      {page === 'reset' ? (
        <ResetPassword setPage={setPage} />
      ) : (
        <Recovered />
      )}
    </>
  );
}
