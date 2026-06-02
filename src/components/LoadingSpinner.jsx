import React from 'react';

// Komponen spinner loading (ditampilkan saat mengambil data dari API)
// DESAIN: Flex center di tengah layar, animasi spin, lingkaran biru dengan border bawah
const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
        </div>
    );
};

export default LoadingSpinner;