//   // // Upload Form

//   const uploadForm = (
//     <>
//       <form
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '40px',
//           width: '300px',
//         }}
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div
//           className="profile-picture-container"
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             gap: '16px',
//           }}
//         >
//           <label htmlFor="profilePic">Add an Artist Profile</label>
//           <Image
//             src={profilePicUrl || avatarAnon}
//             width={100}
//             height={100}
//             alt="profile-pic"
//             style={{ borderRadius: '1000px', objectFit: 'contain' }}
//           />

//           <input
//             {...register('profilePic', { required: true })}
//             type="file"
//             onChange={handleProfilePic}
//           />
//         </div>
//         <input
//           {...register('tapeArtistName', { required: true })}
//           type="text"
//           placeholder="Add Your Tape Artist Name"
//           style={{
//             background: 'transparent',
//             border: 'none',
//             borderBottom: '1px solid white',
//             textAlign: 'right',
//           }}
//         />
//         <input
//           {...register('type', { required: true })}
//           type="text"
//           placeholder="Add A Type (Musician / Podcaster / etc..)"
//           style={{
//             background: 'transparent',
//             border: 'none',
//             borderBottom: '1px solid white',
//             textAlign: 'right',
//           }}
//         />
//         <input
//           {...register('tapeDescription', { required: true })}
//           type="text"
//           placeholder="Add A Description"
//           style={{
//             background: 'transparent',
//             border: 'none',
//             borderBottom: '1px solid white',
//             textAlign: 'right',
//           }}
//         />
//         <div
//           className="pick-profile-color-container"
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             textAlign: 'center',
//             gap: '12px',
//           }}
//         >
//           <p>Pick Profile Color</p>
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'center',
//             }}
//           >
//             <HexColorPicker color={color} onChange={setColor} />
//           </div>
//         </div>
//         <div
//           style={{
//             display: 'flex',
//             gap: '20px',
//             justifyContent: 'center',
//           }}
//         >
//           {/* Cassette Memento*/}
//           <PineappleMemento color={color} />
//           <LoudMemento color={color} />
//           <MinimalMemento color={color} />
//           <CassetteMemento color={color} />
//         </div>

//         <div className={styles.switch}>
//           <input
//             {...register('memento')}
//             name="memento"
//             id="one"
//             type="radio"
//             value="Pineapple"
//           />
//           <label htmlFor="one" style={{ color: `${color}` }}>
//             Pineapple
//           </label>
//           <input
//             {...register('memento')}
//             value="Loud"
//             name="memento"
//             id="two"
//             type="radio"
//           />
//           <label htmlFor="two" style={{ color: `${color}` }}>
//             Loud
//           </label>
//           <input
//             {...register('memento')}
//             name="memento"
//             value="Minimal"
//             id="three"
//             type="radio"
//           />
//           <label htmlFor="three" style={{ color: `${color}` }}>
//             Minimal
//           </label>
//           <input
//             {...register('memento')}
//             value="Tape"
//             name="memento"
//             id="four"
//             type="radio"
//           />
//           <label htmlFor="four" style={{ color: `${color}` }}>
//             Tape
//           </label>
//         </div>
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '10px',
//           }}
//         >
//           <label htmlFor="file">Upload Audio and Images</label>
//           <input
//             type="file"
//             multiple
//             {...register('file', { required: true })}
//             onChange={onChangeFiles}
//           />
//         </div>
//         {errors.file && <p>Need to upload a file.</p>}
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: '20px',
//           }}
//         >
//           <p>Enter in Username Info</p>
//           <div
//             className="email-password"
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '28px',
//             }}
//           >
//             <input
//               {...register('email', { required: true })}
//               type="email"
//               placeholder="Email"
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 borderBottom: '1px solid white',
//                 textAlign: 'right',
//               }}
//             />
//             {errors.email && 'email is required'}
//             <input
//               {...register('password', { required: true })}
//               type="password"
//               placeholder="Password"
//               style={{
//                 background: 'transparent',
//                 border: 'none',
//                 borderBottom: '1px solid white',
//                 textAlign: 'right',
//               }}
//             />
//             {errors.password && 'password is required'}
//           </div>
//         </div>

//         {/* * * - Submit Form Button * */}
//         <button
//           type="submit"
//           style={{
//             backgroundColor: 'white',
//             color: 'black',
//             fontSize: '12px',
//           }}
//         >
//           {loading ? (
//             loader
//           ) : (
//             <>
//               <span style={{ marginRight: '5px' }}>Generate</span>
//               <svg
//                 width="12"
//                 height="12"
//                 viewBox="0 0 21 22"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M11.4844 15.2662C11.4844 15.8117 11.0455 16.2505 10.5 16.2505C9.95449 16.2505 9.51562 15.8117 9.51562 15.2662V3.8609L5.61914 7.75701C5.23359 8.14252 4.61016 8.14252 4.22871 7.75701C3.84727 7.3715 3.84316 6.74812 4.22871 6.36671L9.80273 0.789132C10.1883 0.403623 10.8117 0.403623 11.1932 0.789132L16.7754 6.36671C17.1609 6.75222 17.1609 7.3756 16.7754 7.75701C16.3898 8.13841 15.7664 8.14252 15.385 7.75701L11.4885 3.8609V15.2662H11.4844ZM12.7969 14.9381V12.9696H18.375C19.8229 12.9696 21 14.1466 21 15.5943V18.8753C21 20.323 19.8229 21.5 18.375 21.5H2.625C1.17715 21.5 0 20.323 0 18.8753V15.5943C0 14.1466 1.17715 12.9696 2.625 12.9696H8.20312V14.9381H2.625C2.26406 14.9381 1.96875 15.2334 1.96875 15.5943V18.8753C1.96875 19.2362 2.26406 19.5314 2.625 19.5314H18.375C18.7359 19.5314 19.0312 19.2362 19.0312 18.8753V15.5943C19.0312 15.2334 18.7359 14.9381 18.375 14.9381H12.7969ZM15.75 17.2348C15.75 16.9737 15.8537 16.7234 16.0383 16.5388C16.2229 16.3542 16.4733 16.2505 16.7344 16.2505C16.9954 16.2505 17.2458 16.3542 17.4304 16.5388C17.615 16.7234 17.7188 16.9737 17.7188 17.2348C17.7188 17.4958 17.615 17.7462 17.4304 17.9308C17.2458 18.1154 16.9954 18.2191 16.7344 18.2191C16.4733 18.2191 16.2229 18.1154 16.0383 17.9308C15.8537 17.7462 15.75 17.4958 15.75 17.2348Z"
//                   fill="black"
//                 />
//               </svg>
//             </>
//           )}
//         </button>
//       </form>
//     </>
//   );
