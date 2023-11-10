import React, { useState, useRef, useEffect } from 'react';

function Avatar({ name, bgColor }) {
  console.log('bgColor', bgColor);
  const avatarRef = useRef(null);

  return (
    <div
      ref={avatarRef}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '24px',
        textTransform: 'uppercase',
        background: bgColor,
      }}
    >
      {name[0]}
    </div>
  );
}

export default Avatar;
