const fs = require('fs');
const file = 'src/components/CheckoutModal.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Initial State
// from: const [step, setStep]     = useState(0);
// to:   const [step, setStep]     = useState(user ? 0 : -1);
// Wait, `user` isn't defined inside the outer scope if it's evaluated inside `useState(0)`.
// `const { user, loginWithGoogle } = useAuth();` is right above it.
content = content.replace(
  "const [step, setStep]     = useState(0);",
  "const [step, setStep]     = useState(() => { return (typeof window !== 'undefined' && localStorage.getItem('chaitali_logged_in') === 'true') ? 0 : -1; });\n  \n  useEffect(() => {\n    if (user && step === -1) setStep(0);\n  }, [user]);"
);

// Actually, wait, doing `localStorage.getItem` might be weird if I don't set it.
// Let's just do `useState(user ? 0 : -1)` and a `useEffect` to move them if they login.
content = content.replace(
  "const [step, setStep]     = useState(() => { return (typeof window !== 'undefined' && localStorage.getItem('chaitali_logged_in') === 'true') ? 0 : -1; });\n  \n  useEffect(() => {\n    if (user && step === -1) setStep(0);\n  }, [user]);", // rollback if I already messed it up
  "const [step, setStep]     = useState(0);"
);

content = content.replace(
  "const [step, setStep]     = useState(0);",
  "const [step, setStep]     = useState(-1);\n\n  useEffect(() => {\n    if (user && step === -1) setStep(0);\n  }, [user, step]);\n  \n  useEffect(() => {\n    if (isOpen && !user && step !== -1 && step !== 2) setStep(-1);\n    if (isOpen && user && step === -1) setStep(0);\n  }, [isOpen, user]);"
);

// 2. handleClose
content = content.replace(
  "setStep(0); setDir(1);",
  "setStep(user ? 0 : -1); setDir(1);"
);

// 3. Step 0 (Login) View
const loginView = `
            {/* Step -1: Login */}
            {step === -1 && (
              <motion.div
                key="step-login"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-6 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mb-2 text-[#C9A84C]">
                  <User size={32} />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-stone-800">Checkout</h3>
                <p className="text-stone-500 text-xs px-4">
                  Please log in with Google to quickly fill in your details and earn rewards!
                </p>
                
                <button
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                    } catch (err) {
                       showToast("Failed to login with Google");
                    }
                  }}
                  className="w-full bg-white text-stone-700 font-bold text-sm py-3.5 rounded-2xl shadow-sm border border-stone-200 flex items-center justify-center gap-2 mt-4 hover:bg-stone-50 transition-all"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </button>
                
                <div className="w-full relative flex items-center justify-center mt-2 mb-2">
                  <div className="border-t border-stone-200 w-full absolute"></div>
                  <span className="bg-[#F2EDE4] px-3 text-[10px] text-stone-400 font-bold uppercase relative z-10">OR</span>
                </div>
                
                <button 
                  onClick={() => goTo(0)} 
                  className="w-full bg-[#E5DFD3] text-stone-700 font-bold text-sm py-3.5 rounded-2xl hover:bg-[#D5CFC3] transition-colors"
                >
                  Continue as Guest
                </button>
              </motion.div>
            )}
`;

content = content.replace(
  "{/* Step 0: Address Details */}",
  loginView + "\n\n            {/* Step 0: Address Details */}"
);

// 4. Update Progress Bar to handle step -1 gracefully
content = content.replace(
  "const steps = ['Address', 'Payment'];",
  "const steps = ['Address', 'Payment'];\n  if (step === -1) return null;"
);

// 5. Update form submission to include visitorId explicitly to match the user's logged-in identity
content = content.replace(
  "visitorId:       'anonymous',",
  "visitorId:       user ? (localStorage.getItem('chaitali-artbizz-vid') || 'anonymous') : 'anonymous',"
);

// Fix both places where visitorId is set
content = content.replace(
  "visitorId:       'anonymous',",
  "visitorId:       user ? (localStorage.getItem('chaitali-artbizz-vid') || 'anonymous') : 'anonymous',"
);

fs.writeFileSync(file, content);
console.log('Done modifying CheckoutModal.jsx');
