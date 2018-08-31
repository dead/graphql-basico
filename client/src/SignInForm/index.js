import React from 'react'

const SigninForm = () => (
  <div>
    <form onSubmit={handleSubmit}>
      <label htmlFor='email' style={{ display: 'block' }}>
        Name
      </label>
      <input
        id='email'
        placeholder='Enter your email'
        type='text'
      />
      <button type='submit' disabled={isSubmitting}>
        Submit
      </button>
    </form>
  </div>
)

export default SigninForm
