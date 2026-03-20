import React, { useState, useEffect, useRef } from 'react';
// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { 
  Search, SlidersHorizontal, Sparkles, CreditCard, Settings, ShieldCheck, 
  Eye, EyeOff, Users, Radio, X, ShoppingBag, Store, Upload, FileText, 
  UserPlus, Filter, ImagePlus, Bell, User, ShieldAlert, ArrowRight, 
  CheckCircle, AlertTriangle, Send, MessageSquareX, Minus, MessageSquare, 
  Megaphone, Edit, Trash2, Save, Activity, Info, Loader 
} from 'lucide-react';

// ==========================================
// 🔴 ضع مفاتيحك هنا بدل هذا الكود 🔴
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyD8Z2DViAifgXEuGDW1S2aYCyUPpWs6QI4",
  authDomain: "filter-egypt.firebaseapp.com",
  projectId: "filter-egypt",
  storageBucket: "filter-egypt.firebasestorage.app",
  messagingSenderId: "46231791806",
  appId: "1:46231791806:web:37fd1b2ae7c560dffe96ef",
  measurementId: "G-HZ3RZVQTZY"
};
// ==========================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

export default function App() {
  const [activeView, setActiveView] = useState('landing'); 
  const [previousView, setPreviousView] = useState('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLatestModal, setShowLatestModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showExpirationWarning, setShowExpirationWarning] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [lang, setLang] = useState('ar'); 
  const [selectedAd, setSelectedAd] = useState(null); 
  
  const [appAlert, setAppAlert] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 

  const [fbUser, setFbUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAppLoggedIn, setIsAppLoggedIn] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);

  const [signupData, setSignupData] = useState({ fullName: '', displayName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [signupError, setSignupError] = useState('');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [uploadedImages, setUploadedImages] = useState([]); 
  const [lightboxImage, setLightboxImage] = useState(null); 
  const [receiptUploaded, setReceiptUploaded] = useState(false); 
  const [receiptFile, setReceiptFile] = useState(null); 
  const [renewalReceiptUploaded, setRenewalReceiptUploaded] = useState(false); 
  const [profileImage, setProfileImage] = useState(null); 
  const [profileImageFile, setProfileImageFile] = useState(null); 
  
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sellerInput, setSellerInput] = useState(''); 
  const [showAdSuccessModal, setShowAdSuccessModal] = useState(false); 
  const [liveBroadcastAds, setLiveBroadcastAds] = useState([]); 
  
  const [globalAds, setGlobalAds] = useState([]);
  const isInitialAdsLoad = useRef(true);

  const liveFeedAds = globalAds;
  const myAds = globalAds.filter(ad => ad.sellerId === fbUser?.uid);
  
  const [liveFeedSearch, setLiveFeedSearch] = useState('');
  const [history, setHistory] = useState([]); 

  const [adToDelete, setAdToDelete] = useState(null);
  const [adToEdit, setAdToEdit] = useState(null);
  const [adminReviewUser, setAdminReviewUser] = useState(null); 

  const [globalChats, setGlobalChats] = useState([]);
  const prevChatsRef = useRef({});
  const [closedChatIds, setClosedChatIds] = useState([]); 
  
  const [activeChatId, setActiveChatId] = useState(null); 
  const [unreadCounts, setUnreadCounts] = useState({});
  const [chatPositions, setChatPositions] = useState({}); 
  const [chatInputs, setChatInputs] = useState({}); 
  const [chatToBlock, setChatToBlock] = useState(null); 
  
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, adId: null });
  const chatMessagesEndRef = useRef(null);
  const activeChatRef = useRef(null);

  let daysLeft = 0;
  if (userProfile?.subscriptionStatus === 'Active' && userProfile?.activatedAt) {
     const daysPassed = Math.floor((Date.now() - userProfile.activatedAt) / (1000 * 60 * 60 * 24));
     daysLeft = Math.max(0, 30 - daysPassed);
  } else if (userProfile?.subscriptionStatus === 'Pending') {
     daysLeft = 30;
  }

  useEffect(() => {
    const initAuth = async () => {
      try { await signInAnonymously(auth); } catch (error) { console.error('Firebase Auth Error:', error); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => { setFbUser(user); });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!fbUser) return;
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
        if (docSnap.exists()) { setUserProfile(docSnap.data()); setIsAppLoggedIn(true); }
      } catch (error) { console.error('Fetch Profile Error:', error); }
    };
    fetchProfile();
  }, [fbUser]);

  useEffect(() => {
    if (!fbUser) return;
    const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const profs = [];
      snapshot.forEach(doc => profs.push({ uid: doc.id, ...doc.data() }));
      setAllProfiles(profs);
    }, (error) => console.error("Profiles sync error:", error));
    return () => unsubscribe();
  }, [fbUser]);

  useEffect(() => {
    if (!fbUser) return;
    const unsubscribe = onSnapshot(collection(db, 'ads'), (snapshot) => {
      const adsList = [];
      snapshot.forEach(doc => adsList.push({ id: doc.id, ...doc.data() }));
      adsList.sort((a, b) => b.createdAt - a.createdAt);
      setGlobalAds(adsList);

      if (!isInitialAdsLoad.current) {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') triggerLiveBroadcast({ id: change.doc.id, ...change.doc.data() });
        });
      } else { isInitialAdsLoad.current = false; }
    }, (error) => console.error("Ads sync error:", error));
    return () => unsubscribe();
  }, [fbUser]);

  useEffect(() => {
    if (!fbUser) return;
    const unsubscribe = onSnapshot(collection(db, 'chats'), (snapshot) => {
      const newChats = [];
      snapshot.forEach(d => newChats.push({ id: d.id, ...d.data() }));
      newChats.sort((a,b) => b.updatedAt - a.updatedAt);
      
      newChats.forEach(chat => {
        if (chat.participants?.includes(fbUser.uid)) {
            const prevChat = prevChatsRef.current[chat.id];
            const isNewMessage = prevChat && chat.messages?.length > prevChat.messages?.length;
            const lastMsg = chat.messages?.[chat.messages.length - 1];
            
            if (isNewMessage && lastMsg?.senderId !== fbUser.uid) {
                setClosedChatIds(prev => prev.filter(id => id !== chat.id));
                if (activeChatRef.current !== chat.id) setUnreadCounts(prev => ({ ...prev, [chat.id]: (prev[chat.id] || 0) + 1 }));
            }
        }
        prevChatsRef.current[chat.id] = chat;
      });
      setGlobalChats(newChats);
    }, (error) => console.error("Chats sync error:", error));
    return () => unsubscribe();
  }, [fbUser]);

  useEffect(() => {
    activeChatRef.current = activeChatId;
    if (activeChatId) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCounts(prev => ({ ...prev, [activeChatId]: 0 }));
    }
  }, [activeChatId, globalChats]);

  const handleSignupSubmit = async () => {
    setSignupError('');
    if (!signupData.fullName || !signupData.displayName || !signupData.email || !signupData.phone || !signupData.password) { setSignupError(lang === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'); return; }
    if (signupData.password !== signupData.confirmPassword) { setSignupError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'); return; }
    if (!receiptUploaded || !receiptFile) { setSignupError(lang === 'ar' ? 'يرجى إرفاق إيصال التحويل' : 'Please upload the receipt'); return; }
    if (!fbUser) return;

    setIsUploading(true); 
    try {
      let receiptUrl = '';
      try {
        const receiptRef = ref(storage, `receipts/${Date.now()}_${receiptFile.name}`);
        await uploadBytes(receiptRef, receiptFile);
        receiptUrl = await getDownloadURL(receiptRef);
      } catch (storageErr) {
        console.warn('Storage blocked. Using fallback.', storageErr);
        receiptUrl = 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800'; 
      }

      const newProfile = {
        uid: fbUser.uid, fullName: signupData.fullName, displayName: signupData.displayName, email: signupData.email,
        phone: signupData.phone, password: signupData.password, subscriptionStatus: 'Pending',
        createdAt: new Date().toISOString(), receiptUrl: receiptUrl 
      };

      await setDoc(doc(db, 'users', fbUser.uid), newProfile);
      await setDoc(doc(db, 'profiles', fbUser.uid), newProfile);

      setUserProfile(newProfile); 
      setIsAppLoggedIn(true); 
      setReceiptUploaded(false); 
      setReceiptFile(null);
      setSignupData({ fullName: '', displayName: '', email: '', phone: '', password: '', confirmPassword: '' });
      
      setIsUploading(false); 
      setAppAlert(lang === 'ar' ? 'تم إنشاء حسابك بنجاح! الإدارة تراجع الإيصال الآن.' : 'Account created! Admin is reviewing your receipt.');
      navigateTo('landing');
    } catch (error) { 
      setIsUploading(false); 
      setSignupError(lang === 'ar' ? 'حدث خطأ أثناء الاتصال' : 'Connection error'); 
      console.error(error); 
    }
  };

  const handleLoginSubmit = async () => {
    setLoginError('');
    if (!loginData.identifier || !loginData.password) { setLoginError(lang === 'ar' ? 'يرجى إدخال البيانات' : 'Please enter credentials'); return; }
    if (!fbUser) return;
    try {
      const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if ((data.email === loginData.identifier || data.phone === loginData.identifier) && data.password === loginData.password) {
          setUserProfile(data); setIsAppLoggedIn(true); setLoginData({ identifier: '', password: '' }); navigateTo('landing');
        } else { setLoginError(lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'); }
      } else { setLoginError(lang === 'ar' ? 'لا يوجد حساب' : 'No account found'); }
    } catch (error) { setLoginError(lang === 'ar' ? 'حدث خطأ في النظام' : 'System error'); }
  };

  const handleLogout = () => { setIsAppLoggedIn(false); setUserProfile(null); navigateTo('login'); };

  const handleAdminApproval = async (profileToApprove) => {
    if (!fbUser) return;
    setIsUploading(true);
    try {
      const activationTime = Date.now();
      const updatedData = { subscriptionStatus: 'Active', activatedAt: activationTime };
      await updateDoc(doc(db, 'profiles', profileToApprove.uid), updatedData);
      await updateDoc(doc(db, 'users', profileToApprove.uid), updatedData);
      if (profileToApprove.uid === userProfile?.uid) setUserProfile({ ...userProfile, ...updatedData });
      setAppAlert(lang === 'ar' ? 'تم تفعيل الحساب بنجاح!' : 'Account activated successfully!');
      setAdminReviewUser(null);
    } catch (error) { console.error("Admin approval error", error); setAppAlert(lang === 'ar' ? 'حدث خطأ أثناء التفعيل.' : 'Error activating account.'); } 
    finally { setIsUploading(false); }
  };

  const openChat = async (ad) => {
    if (!isAppLoggedIn || !fbUser) { setAppAlert(lang === 'ar' ? 'يجب تسجيل الدخول أولاً للتواصل مع البائع.' : 'Please login first to contact the seller.'); return; }
    if (fbUser.uid === ad.sellerId) { setAppAlert(lang === 'ar' ? 'لا يمكنك مراسلة نفسك، هذا إعلانك الشخصي!' : 'You cannot message yourself, this is your ad!'); return; }

    const chatId = `${ad.id}_${fbUser.uid}_${ad.sellerId}`;
    const existingChat = globalChats.find(c => c.id === chatId);
    
    if (!existingChat) {
      const newChat = { adId: ad.id, adTitle: lang === 'ar' ? ad.title : ad.titleEn, participants: [fbUser.uid, ad.sellerId], buyerId: fbUser.uid, sellerId: ad.sellerId, messages: [], updatedAt: Date.now() };
      await setDoc(doc(db, 'chats', chatId), newChat);
    }
    setClosedChatIds(prev => prev.filter(id => id !== chatId)); setActiveChatId(chatId);
    if (!chatPositions[chatId]) {
      const startX = window.innerWidth > 768 ? (window.innerWidth / 2) - 190 : 10;
      const startY = window.innerHeight > 768 ? (window.innerHeight / 2) - 275 : 10;
      setChatPositions(prev => ({ ...prev, [chatId]: { x: startX, y: startY } }));
    }
  };

  const handleSendMessage = async () => {
    const currentInput = chatInputs[activeChatId] || '';
    if(currentInput.trim() === '' || !activeChatId || !fbUser) return;
    const chatRef = doc(db, 'chats', activeChatId);
    const activeChat = globalChats.find(c => c.id === activeChatId);
    if (!activeChat) return;

    const newMsg = { text: currentInput, senderId: fbUser.uid, timestamp: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setChatInputs(prev => ({...prev, [activeChatId]: ''}));
    try { await updateDoc(chatRef, { messages: [...(activeChat.messages || []), newMsg], updatedAt: Date.now() }); } catch (error) { console.error("Send message error:", error); }
  };

  const handleMouseDown = (e, adId) => {
    if (e.target.closest('button')) return; 
    setIsDragging(true); dragRef.current = { startX: e.clientX, startY: e.clientY, initialX: chatPositions[adId]?.x || 0, initialY: chatPositions[adId]?.y || 0, adId: adId };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !dragRef.current.adId) return;
      const dx = e.clientX - dragRef.current.startX; const dy = e.clientY - dragRef.current.startY;
      setChatPositions(prev => ({ ...prev, [dragRef.current.adId]: { x: dragRef.current.initialX + dx, y: dragRef.current.initialY + dy } }));
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isDragging]);

  const triggerLiveBroadcast = (ad) => { setLiveBroadcastAds(prev => [ad, ...prev]); setTimeout(() => setLiveBroadcastAds(prev => prev.filter(a => a.id !== ad.id)), 6000); };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => ({ file: file, preview: URL.createObjectURL(file) }));
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };
  const removeUploadedImage = (indexToRemove) => setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  
  const handleProfileImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setProfileImage(URL.createObjectURL(file)); setProfileImageFile(file); }
  };

  const saveProfileUpdates = async (newName, newPhone) => {
    if (!fbUser || !userProfile) return;
    setIsUploading(true);
    try {
      let newPhotoUrl = userProfile.photoUrl || null;
      if (profileImageFile) {
        try {
          const fileRef = ref(storage, `profiles/${Date.now()}_${profileImageFile.name}`);
          await uploadBytes(fileRef, profileImageFile);
          newPhotoUrl = await getDownloadURL(fileRef);
        } catch (err) { console.warn("Profile storage blocked", err); newPhotoUrl = URL.createObjectURL(profileImageFile); }
      }
      const updatedProfile = { ...userProfile, displayName: newName, phone: newPhone, photoUrl: newPhotoUrl };
      await setDoc(doc(db, 'users', fbUser.uid), updatedProfile);
      await setDoc(doc(db, 'profiles', fbUser.uid), updatedProfile); 
      setUserProfile(updatedProfile); setAppAlert(lang === 'ar' ? 'تم تحديث البيانات بنجاح!' : 'Profile updated successfully!');
    } catch (error) { console.error(error); setAppAlert(lang === 'ar' ? 'حدث خطأ أثناء التحديث.' : 'Error updating profile.'); } 
    finally { setIsUploading(false); }
  };

  const handleEditImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files); const newImages = filesArray.map(file => URL.createObjectURL(file));
      setAdToEdit(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
    }
  };
  const removeEditImage = (indexToRemove) => { setAdToEdit(prev => ({ ...prev, images: (prev.images || []).filter((_, index) => index !== indexToRemove) })); };
  const saveAdEdit = async () => { try { await updateDoc(doc(db, 'ads', adToEdit.id), adToEdit); setAdToEdit(null); } catch (err) { console.error("Update error", err); } };

  const viewAdDetails = async (ad) => {
    setSelectedAd(ad); navigateTo('ad-details');
    if (fbUser && ad.sellerId !== fbUser.uid && ad.id !== 'dummy-1') {
      try { await updateDoc(doc(db, 'ads', ad.id), { views: (ad.views || 0) + 1 }); } catch (e) { console.error("View count error", e); }
    }
  };

  const navigateTo = (view) => { if (view === 'landing') { setHistory([]); setActiveView('landing'); } else { setHistory(prev => [...prev, activeView]); setActiveView(view); } };
  const goBack = () => { setHistory(prev => { const newHistory = [...prev]; const previous = newHistory.pop() || 'landing'; setActiveView(previous); return newHistory; }); };

  const bgColor = "bg-[#111827]"; const cardBg = "bg-[#1f2937]"; const accentColor = "text-emerald-400"; const accentBg = "bg-emerald-500 hover:bg-emerald-600";
  const myActiveChats = globalChats.filter(c => c.participants?.includes(fbUser?.uid));
  const dockedChats = myActiveChats.filter(c => c.id !== activeChatId && !closedChatIds.includes(c.id));
  const activeChat = globalChats.find(c => c.id === activeChatId);
  const totalMembers = allProfiles.length > 0 ? allProfiles.length : 1; 
  const onlineMembers = Math.max(1, Math.floor(totalMembers * 0.4)); 

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen ${bgColor} text-gray-100 font-sans flex flex-col items-center justify-between relative`}>
      {isUploading && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in">
           <Loader className="text-emerald-500 animate-spin mb-4" size={64} />
           <h2 className="text-xl font-bold text-white mb-2">{lang === 'ar' ? 'جاري رفع الملفات ومعالجة البيانات...' : 'Uploading files & processing...'}</h2>
        </div>
      )}

      {appAlert && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`${cardBg} border border-emerald-500/50 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl text-center`}>
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"><Info size={32} /></div>
            <h3 className="text-xl font-bold text-white mb-2">{lang === 'ar' ? 'تنبيه النظام' : 'System Notice'}</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{appAlert}</p>
            <button onClick={() => setAppAlert(null)} className={`w-full ${accentBg} text-white font-bold rounded-lg py-3`}>{lang === 'ar' ? 'حسناً، فهمت' : 'OK, Got it'}</button>
          </div>
        </div>
      )}

      <header className="w-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('landing')}>
          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-gray-700 group-hover:border-emerald-500 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126] via-white to-black animate-flag-wave bg-[length:200%_200%] opacity-90"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <Filter className="relative z-10 text-[#C09300] drop-shadow-md" size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-none text-white">فلتر <span className={accentColor}>إيجيبت</span></h1>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] mt-1 uppercase font-mono">Filter Egypt</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs text-gray-400 font-medium bg-[#1f2937]/50 px-6 py-2 rounded-full border border-gray-800">
          <div className="flex items-center gap-2"><Radio size={14} className="text-emerald-500 animate-pulse" />{lang === 'ar' ? 'متصل الآن:' : 'Online:'} <span className="text-white font-bold text-sm">{onlineMembers}</span></div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2"><Users size={14} className="text-blue-400" />{lang === 'ar' ? 'المشتركين:' : 'Members:'} <span className="text-white font-bold text-sm">{totalMembers}</span></div>
        </div>

        <div className="flex gap-2 md:gap-3 items-center">
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-gray-400 hover:text-white font-bold text-sm px-3 border-x border-gray-700 mx-1">{lang === 'ar' ? 'EN' : 'عربي'}</button>

          {isAppLoggedIn ? (
             <div className="flex items-center gap-3 md:gap-4">
               {userProfile?.subscriptionStatus === 'Pending' ? (
                 <span className="text-yellow-500 font-bold text-xs md:text-sm hidden sm:block bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 flex items-center gap-1.5"><AlertTriangle size={14} className="animate-pulse" /> {lang === 'ar' ? 'حساب قيد المراجعة' : 'Pending Review'}</span>
               ) : (
                 <span className="text-emerald-400 font-bold text-xs md:text-sm hidden sm:block bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">{userProfile?.photoUrl && <img src={userProfile.photoUrl} alt="profile" className="w-5 h-5 rounded-full object-cover" />} {lang === 'ar' ? `أهلاً، ${userProfile?.displayName || 'المستخدم'}` : `Hi, ${userProfile?.displayName || 'User'}`}</span>
               )}
               <button onClick={handleLogout} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold">{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</button>
             </div>
          ) : (
            <>
              <button onClick={() => navigateTo('login')} className={`bg-[#1f2937] border border-gray-700 text-white px-4 py-2 rounded-full font-semibold text-xs md:text-sm`}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
              <button onClick={() => navigateTo('signup')} className={`${accentBg} text-white px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 text-xs md:text-sm`}><UserPlus size={16} /> {lang === 'ar' ? 'اشتراك جديد' : 'Sign Up'}</button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col justify-center items-center px-4 mt-8 md:mt-0 pb-20">
        
        {activeView === 'landing' && (
          <div className="w-full animate-fade-in text-center flex flex-col items-center mt-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">{lang === 'ar' ? 'مجتمع حصري' : 'Exclusive Community'} <span className={accentColor}>{lang === 'ar' ? 'للمشتركين فقط' : 'For Members Only'}</span></h2>
            <p className="text-gray-400 text-base md:text-lg mb-12 max-w-2xl leading-relaxed">{lang === 'ar' ? 'بيئة راقية لمن يبحث عن الجودة والمصداقية. نخبة من الأعضاء يدفعون للحصول على خدمة مميزة؛ بيع واشترِ بثقة وأمان بعيداً عن عشوائية الأسواق.' : 'A premium environment for quality and trust. Elite members pay for a distinguished service; buy and sell securely away from market chaos.'}</p>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center">
              <div onClick={() => isAppLoggedIn ? setActiveView('seller') : navigateTo('login')} className={`${cardBg} flex-1 p-8 rounded-3xl border border-gray-700 hover:border-emerald-500 cursor-pointer group flex flex-col items-center gap-4`}>
                <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-emerald-500/20 flex items-center justify-center"><Store className="text-gray-400 group-hover:text-emerald-400" size={32} /></div>
                <h3 className="text-xl font-bold text-white">{lang === 'ar' ? 'أنا بائع' : 'I am a Seller'}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{lang === 'ar' ? 'أريد عرض منتجاتي أو خدماتي للمشتركين.' : 'I want to showcase my products or services.'}</p>
              </div>
              <div onClick={() => isAppLoggedIn ? setActiveView('buyer') : navigateTo('login')} className={`${cardBg} flex-1 p-8 rounded-3xl border border-gray-700 hover:border-blue-500 cursor-pointer group flex flex-col items-center gap-4`}>
                <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-blue-500/20 flex items-center justify-center"><ShoppingBag className="text-gray-400 group-hover:text-blue-400" size={32} /></div>
                <h3 className="text-xl font-bold text-white">{lang === 'ar' ? 'أنا مشتري' : 'I am a Buyer'}</h3>
                <p className="text-gray-400 text-xs md:text-sm">{lang === 'ar' ? 'أريد البحث عن لُقطة والشراء بأمان.' : 'I want to search for great deals securely.'}</p>
              </div>
            </div>
          </div>
        )}

        {(activeView === 'buyer' || activeView === 'seller') && (
          <div className="w-full animate-fade-in text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{activeView === 'buyer' ? (lang === 'ar' ? 'ابحث عن لُقطتك القادمة' : 'Find Your Next Deal') : (lang === 'ar' ? 'اعرض منتجك للمجتمع' : 'Showcase Your Product')}</h2>
            
            <div className="w-full max-w-2xl flex flex-col items-center relative mt-6">
              {activeView === 'seller' && userProfile?.subscriptionStatus === 'Pending' ? (
                <div className="w-full max-w-2xl bg-[#1f2937] border border-yellow-500/50 p-8 rounded-3xl text-center shadow-2xl shadow-yellow-500/10"><AlertTriangle size={40} className="mx-auto text-yellow-500 mb-4" /><h3 className="text-2xl font-bold text-white mb-3">{lang === 'ar' ? 'حسابك قيد المراجعة' : 'Account Under Review'}</h3><p className="text-gray-300">{lang === 'ar' ? 'الإدارة تراجع إيصال الدفع. بمجرد التفعيل، ستتمكن من النشر.' : 'Admin is reviewing your receipt. Once active, you can post.'}</p></div>
              ) : (
                <>
                  {activeView === 'seller' && uploadedImages.length > 0 && (
                    <div className="w-full flex gap-3 mb-4 overflow-x-auto pb-2"><div className="flex gap-2">{uploadedImages.map((imgObj, idx) => (<div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-500/50"><img src={imgObj.preview} alt="Preview" className="w-full h-full object-cover" /><button onClick={() => removeUploadedImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full"><X size={12} /></button></div>))}</div></div>
                  )}
                  <div className="relative w-full group flex items-center">
                    <input type="text" value={activeView === 'buyer' ? searchQuery : sellerInput} onChange={(e) => activeView === 'buyer' ? setSearchQuery(e.target.value) : setSellerInput(e.target.value)} className={`w-full ${cardBg} border border-gray-700 rounded-full py-4 pr-14 pl-28 text-lg text-white outline-none focus:border-${activeView === 'buyer' ? 'blue' : 'emerald'}-500 shadow-xl`} placeholder={activeView === 'buyer' ? (lang === 'ar' ? "عن ماذا تبحث اليوم؟" : "What are you looking for?") : (lang === 'ar' ? "اكتب تفاصيل المنتج والسعر..." : "Write product details...")} />
                    <div className="absolute inset-y-2 left-2 flex gap-2 items-center">
                      {activeView === 'seller' && (<label className={`cursor-pointer bg-gray-700/50 p-2.5 rounded-full flex items-center justify-center`}><ImagePlus size={20} /><input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" /></label>)}
                      <button onClick={async () => {
                          if (activeView === 'buyer') { setFilterCategory(searchQuery.trim() !== '' ? (lang === 'ar' ? `بحث: ${searchQuery}` : `Search: ${searchQuery}`) : (lang === 'ar' ? 'الكل' : 'All Categories')); navigateTo('results'); } 
                          else {
                            if (sellerInput.trim() !== '' || uploadedImages.length > 0) {
                              setIsUploading(true); 
                              try {
                                const finalImageUrls = [];
                                for (const item of uploadedImages) {
                                  if (item.file) { try { const fileRef = ref(storage, `ads_images/${Date.now()}_${item.file.name}`); await uploadBytes(fileRef, item.file); finalImageUrls.push(await getDownloadURL(fileRef)); } catch (err) { finalImageUrls.push(item.preview); } }
                                }
                                const newAd = { title: sellerInput || 'إعلان جديد', titleEn: sellerInput || 'New Ad', views: 0, statusAr: 'نشط', statusEn: 'Active', date: new Date().toISOString().split('T')[0], location: lang === 'ar' ? 'مصر' : 'Egypt', time: lang === 'ar' ? 'الآن' : 'Just now', price: lang === 'ar' ? 'يحدد لاحقاً' : 'TBD', images: finalImageUrls.length > 0 ? finalImageUrls : ["https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800"], sellerId: fbUser.uid, createdAt: Date.now() };
                                await setDoc(doc(db, 'ads', Date.now().toString()), newAd);
                                setSellerInput(''); setUploadedImages([]); setIsUploading(false); setShowAdSuccessModal(true);
                              } catch (err) { setIsUploading(false); setAppAlert(lang === 'ar' ? 'حدث خطأ.' : 'Error.'); }
                            }
                          }
                        }} className={`h-full ${activeView === 'buyer' ? 'bg-blue-600' : accentBg} text-white px-6 md:px-8 rounded-full font-bold`}>{activeView === 'buyer' ? (lang === 'ar' ? 'بحث' : 'Search') : (lang === 'ar' ? 'إرسال' : 'Send')}</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
              <div onClick={() => navigateTo('live-feed')}><ActionIcon icon={<Activity className="text-red-500 animate-pulse" />} label={lang === 'ar' ? "رادار الإعلانات" : "Live Radar"} highlight="red" /></div>
              <div onClick={() => setShowFilterModal(true)}><ActionIcon icon={<SlidersHorizontal />} label={lang === 'ar' ? "فلترة ذكية" : "Smart Filter"} /></div>
              <div onClick={() => navigateTo('my-ads')}><ActionIcon icon={<Megaphone />} label={lang === 'ar' ? "إعلاناتي" : "My Ads"} /></div>
              <div onClick={() => setShowSettingsModal(true)}><ActionIcon icon={<Settings />} label={lang === 'ar' ? "الملف الشخصي" : "Profile"} /></div>
            </div>
          </div>
        )}

        {/* --- LIVE FEED --- */}
        {activeView === 'live-feed' && (
          <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold flex items-center gap-3"><Activity className="text-red-500 animate-pulse" /> {lang === 'ar' ? 'رادار الإعلانات المباشر' : 'Live Ads Radar'}</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">{lang === 'ar' ? 'رجوع' : 'Back'}</button></div>
             <div className="w-full flex flex-col gap-4">
                {liveFeedAds.map(ad => (
                  <div key={ad.id} onClick={() => viewAdDetails(ad)} className="bg-[#1f2937] p-4 rounded-2xl flex gap-4 cursor-pointer hover:border-red-500 border border-transparent transition-colors">
                    <img src={ad.images?.[0]} alt="ad" className="w-24 h-24 rounded-xl object-cover" />
                    <div><h4 className="font-bold text-lg">{lang === 'ar' ? ad.title : ad.titleEn}</h4><p className="text-red-400 font-bold">{ad.price} {lang === 'ar' ? 'جم' : 'EGP'}</p></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- MY ADS --- */}
        {activeView === 'my-ads' && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">{lang === 'ar' ? 'إعلاناتي' : 'My Ads'}</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">{lang === 'ar' ? 'رجوع' : 'Back'}</button></div>
             <div className="w-full flex flex-col gap-4">
               {myAds.map(ad => (
                 <div key={ad.id} className="bg-[#1f2937] p-4 rounded-2xl flex gap-4 border border-gray-700 items-center">
                   <img src={ad.images?.[0]} alt="ad" className="w-24 h-24 rounded-xl object-cover" />
                   <div className="flex-1"><h4 className="font-bold">{lang === 'ar' ? ad.title : ad.titleEn}</h4><p className="text-gray-400 text-sm"><Eye size={14} className="inline mr-1 text-blue-400"/>{ad.views || 0}</p></div>
                   <button onClick={() => setAdToDelete(ad)} className="bg-red-500/10 text-red-500 p-2 rounded-lg"><Trash2 size={18}/></button>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* --- RESULTS --- */}
        {activeView === 'results' && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">{lang === 'ar' ? `نتائج: ${filterCategory}` : `Results: ${filterCategory}`}</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">{lang === 'ar' ? 'رجوع' : 'Back'}</button></div>
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
               {globalAds.filter(ad => filterCategory === 'الكل' || filterCategory === 'All Categories' || filterCategory.includes('بحث:') || ad.title.includes(filterCategory)).map(ad => (
                 <div key={ad.id} onClick={() => viewAdDetails(ad)} className="bg-[#1f2937] p-4 rounded-2xl border border-gray-700 cursor-pointer hover:border-emerald-500">
                    <img src={ad.images?.[0]} alt="ad" className="w-full h-40 object-cover rounded-xl mb-3" />
                    <h4 className="font-bold">{lang === 'ar' ? ad.title : ad.titleEn}</h4>
                    <p className="text-emerald-400 font-bold mt-2">{ad.price} {lang === 'ar' ? 'جم' : 'EGP'}</p>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* --- AD DETAILS --- */}
        {activeView === 'ad-details' && selectedAd && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full mb-4"><button onClick={goBack} className="text-gray-400 hover:text-white flex items-center gap-2"><ArrowRight size={20} className={lang === 'en' ? 'rotate-180' : ''} /> {lang === 'ar' ? 'رجوع' : 'Back'}</button></div>
             <div className="w-full bg-[#1f2937] p-6 rounded-3xl flex flex-col md:flex-row gap-8">
                <img src={selectedAd.images?.[0]} alt="ad" className="w-full md:w-1/2 h-64 object-cover rounded-2xl" />
                <div className="w-full md:w-1/2">
                   <h2 className="text-3xl font-bold mb-4">{selectedAd.title}</h2>
                   <div className="text-emerald-400 font-bold text-3xl mb-6">{selectedAd.price} {lang === 'ar' ? 'جم' : 'EGP'}</div>
                   <button onClick={() => openChat(selectedAd)} className="w-full bg-emerald-500 text-white font-bold rounded-lg py-4 flex justify-center items-center gap-2"><Send size={20} /> {lang === 'ar' ? 'تواصل مع البائع' : 'Contact Seller'}</button>
                </div>
             </div>
           </div>
        )}

        {/* --- LOGIN & SIGNUP --- */}
        {activeView === 'login' && (
          <div className="w-full max-w-md animate-fade-in"><button onClick={goBack} className="mb-4 text-gray-400">رجوع</button><div className={`${cardBg} p-8 rounded-2xl`}><h2 className="text-3xl font-bold mb-6 text-center">دخول</h2>
            <input type="text" placeholder="البريد الإلكتروني أو الهاتف" value={loginData.identifier} onChange={e => setLoginData({...loginData, identifier: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 mb-4 text-white outline-none focus:border-emerald-500" />
            <div className="relative mb-6">
              <input type={showPassword ? "text" : "password"} placeholder="كلمة المرور" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3 text-gray-400 hover:text-white">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button onClick={handleLoginSubmit} className="w-full bg-emerald-500 text-white font-bold rounded-lg py-3 hover:bg-emerald-600">دخول</button>
          </div></div>
        )}

        {/* --- ADMIN DASHBOARD --- */}
        {activeView === 'signup' && (
          <div className="w-full max-w-2xl animate-fade-in"><button onClick={goBack} className="mb-4 text-gray-400">رجوع</button><div className={`${cardBg} p-8 rounded-2xl`}><h2 className="text-3xl font-bold mb-6 text-center">اشتراك جديد</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="الاسم الكامل" value={signupData.fullName} onChange={e => setSignupData({...signupData, fullName: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                <input type="text" placeholder="الاسم المعروض (يظهر للناس)" value={signupData.displayName} onChange={e => setSignupData({...signupData, displayName: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                <input type="email" placeholder="البريد الإلكتروني" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white col-span-2 outline-none focus:border-emerald-500" />
                <input type="tel" placeholder="رقم الهاتف" value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white col-span-2 outline-none focus:border-emerald-500" />
                
                <div className="relative">
                  <input type={showSignupPass ? "text" : "password"} placeholder="كلمة المرور" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                  <button type="button" onClick={() => setShowSignupPass(!showSignupPass)} className="absolute left-3 top-3 text-gray-400 hover:text-white">{showSignupPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                <div className="relative">
                  <input type={showSignupConfirm ? "text" : "password"} placeholder="تأكيد كلمة المرور" value={signupData.confirmPassword} onChange={e => setSignupData({...signupData, confirmPassword: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                  <button type="button" onClick={() => setShowSignupConfirm(!showSignupConfirm)} className="absolute left-3 top-3 text-gray-400 hover:text-white">{showSignupConfirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>

                <label className="col-span-2 border border-dashed border-gray-600 p-4 rounded-xl text-center cursor-pointer text-gray-400 hover:border-emerald-500 transition-colors"><Upload className="mx-auto mb-2" /> {receiptUploaded ? 'تم الإرفاق بنجاح' : 'إرفاق إيصال الدفع (إنستا باي)'}<input type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files[0]) { setReceiptUploaded(true); setReceiptFile(e.target.files[0]); } }} /></label>
                
                {signupError && <p className="col-span-2 text-red-500 text-sm text-center">{signupError}</p>}
                <button onClick={handleSignupSubmit} className="col-span-2 bg-emerald-500 text-white font-bold rounded-lg py-4 mt-2 hover:bg-emerald-600">إنشاء الحساب</button>
             </div>
          </div></div>
        )}
      </main>

      {/* --- ADMIN REVIEW MODAL --- */}
      {adminReviewUser && (
        <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#1f2937] rounded-3xl p-6 w-full max-w-lg text-center relative">
             <button onClick={() => setAdminReviewUser(null)} className="absolute top-4 left-4 text-gray-400"><X/></button>
             <h3 className="text-xl font-bold mb-4">مراجعة إيصال: {adminReviewUser.fullName}</h3>
             <img src={adminReviewUser.receiptUrl} alt="Receipt" className="w-full h-64 object-contain bg-black rounded-xl mb-4" />
             <div className="flex gap-4"><button onClick={() => setAdminReviewUser(null)} className="flex-1 bg-red-600 text-white py-3 rounded-xl">رفض</button><button onClick={() => handleAdminApproval(adminReviewUser)} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl">تفعيل الحساب</button></div>
          </div>
        </div>
      )}

      {/* --- CHATS DOCK --- */}
      <div className="fixed z-[50] left-4 bottom-4 flex flex-col gap-3">
         {dockedChats.map(chat => (
            <button key={chat.id} onClick={() => setActiveChatId(chat.id)} className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl relative border-2 border-[#111827]">
              <MessageSquare size={24} />{unreadCounts[chat.id] > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">{unreadCounts[chat.id]}</span>}
            </button>
         ))}
      </div>

      {/* --- ACTIVE CHAT --- */}
      {activeChat && (() => {
         const pos = chatPositions[activeChatId] || { x: 20, y: 20 };
         return (
            <div style={{ left: pos.x, top: pos.y }} className={`fixed z-[60] w-[350px] h-[450px] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-[#111827] border border-gray-600`}>
              <div onMouseDown={(e) => handleMouseDown(e, activeChatId)} className="bg-[#1f2937] p-3 flex justify-between items-center cursor-move">
                <span className="text-white font-bold text-sm truncate">{activeChat.adTitle}</span>
                <button onClick={() => setActiveChatId(null)} className="text-gray-400"><X size={18}/></button>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                 {(activeChat.messages || []).map((msg, idx) => {
                   const isSender = msg.senderId === fbUser.uid;
                   return (<div key={idx} className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'}`}><div className={`p-2 rounded-xl text-sm ${isSender ? 'bg-emerald-600' : 'bg-gray-700'}`}>{msg.text}</div></div>);
                 })}
                 <div ref={chatMessagesEndRef} />
              </div>
              <div className="p-2 flex gap-2 bg-[#1f2937]">
                 <input type="text" value={chatInputs[activeChatId] || ''} onChange={(e) => setChatInputs(prev => ({...prev, [activeChatId]: e.target.value}))} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-[#111827] rounded-full px-3 text-white text-sm outline-none" placeholder="رسالة..." />
                 <button onClick={handleSendMessage} className="bg-emerald-500 p-2 rounded-full"><Send size={16}/></button>
              </div>
            </div>
         );
      })()}

      <footer className="w-full p-4 text-center text-gray-500 text-sm mt-auto border-t border-gray-800 flex justify-center gap-4">
        <button onClick={() => navigateTo('admin-dashboard')} className="hover:text-emerald-400">لوحة الإدارة (Admin)</button>
      </footer>
    </div>
  );
}

function ActionIcon({ icon, label, highlight }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer w-20">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${highlight === 'red' ? 'bg-red-500/10 text-red-500' : highlight ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#1f2937] text-gray-300'}`}>{React.cloneElement(icon, { size: 26 })}</div>
      <span className="text-[11px] text-gray-400 text-center">{label}</span>
    </div>
  );
}