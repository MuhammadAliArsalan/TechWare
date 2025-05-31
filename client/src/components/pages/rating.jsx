// import React, { useState } from "react";
// import "./rating.css";

// const Rating = ({addReview}) => {
//     const [rating, setRating] = useState(0);
//     const [username, setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [opinion, setOpinion] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const newReview = {username, email, rating, content: opinion};
//         addReview(newReview); // Pass review to parent state
//         // Handle form submission logic
//         console.log({ username, email, rating, opinion });
//         alert("Thank you for your feedback!");
//         // Reset fields after submission
//         setUsername("");
//         setEmail("");
//         setRating(0);
//         setOpinion("");
//     };

//     return (
//         <div className="wrapper">
//             <h3>RATE US</h3>
//             <form onSubmit={handleSubmit}>
//                 {/* Username and Email Fields */}
//                 <input
//                     type="text"
//                     name="username"
//                     placeholder="Enter your name"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />

//                 {/* Star Rating */}
//                 {/* <div className="rating">
//                     <input type="number" name="rating" hidden value={rating} readOnly />
//                     {[1, 2, 3, 4, 5].map((num) => (
//                         <div key={num} className="star" onClick={() => setRating(num)}>
//                             <ion-icon name={num <= rating ? "star" : "star-outline"}></ion-icon>
//                         </div>
//                     ))}
//                 </div> */}

//                 <div className="rating">
//                     {[1, 2, 3, 4, 5].map((num) => (
//                         <div key={num} className="star" onClick={() => setRating(num)}>
//                             <svg
//                                 width="30"
//                                 height="30"
//                                 viewBox="0 0 24 24"
//                                 fill={num <= rating ? "#FFD700" : "none"}
//                                 stroke="#FFD700"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <polygon points="12 2 15 9 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 9" />
//                             </svg>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Opinion Text Area */}
//                 <textarea
//                     name="opinion"
//                     cols={30}
//                     rows={5}
//                     placeholder="Your opinion..."
//                     value={opinion}
//                     onChange={(e) => setOpinion(e.target.value)}
//                 ></textarea>

//                 {/* Buttons */}
//                 <div className="btn-group">
//                     <button type="submit" className="btn-submit">SUBMIT</button>
//                     <button type="button" className="btn-cancel" onClick={() => {
//                         setUsername("");
//                         setEmail("");
//                         setRating(0);
//                         setOpinion("");
//                     }}>CANCEL</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Rating;


import React, { useState } from "react";
import "./rating.css";

const Rating = ({ addReview }) => {
    const [rating, setRating] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [opinion, setOpinion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!username || !email || !rating) {
            alert("Please fill all required fields");
            return;
        }

        const newReview = {
            username, 
            email, 
            rating, 
            content: opinion,
            date: new Date().toISOString()
        };
        
        addReview(newReview);
        
        // Reset form
        setUsername("");
        setEmail("");
        setRating(0);
        setOpinion("");
    };

    return (
        <div className="wrapper">
            <h3>RATE US</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="rating">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div 
                            key={num} 
                            className={`star ${num <= rating ? 'active' : ''}`}
                            onClick={() => setRating(num)}
                        >
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill={num <= rating ? "#FFD700" : "none"}
                                stroke="#FFD700"
                                strokeWidth="2"
                            >
                                <polygon points="12 2 15 9 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 9" />
                            </svg>
                        </div>
                    ))}
                </div>

                <textarea
                    cols={30}
                    rows={5}
                    placeholder="Your opinion..."
                    value={opinion}
                    onChange={(e) => setOpinion(e.target.value)}
                ></textarea>

                <div className="btn-group">
                    <button type="submit" className="btn-submit">SUBMIT</button>
                    <button 
                        type="button" 
                        className="btn-cancel" 
                        onClick={() => {
                            setUsername("");
                            setEmail("");
                            setRating(0);
                            setOpinion("");
                        }}
                    >
                        CANCEL
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Rating;