import React, { useState, useEffect, useRef } from 'react';
// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, deleteDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

import { 
  Search, SlidersHorizontal, Sparkles, CreditCard, Settings, ShieldCheck, 
  Eye, EyeOff, Users, Radio, X, ShoppingBag, Store, Upload, FileText, 
  UserPlus, Filter, ImagePlus, Bell, User, ShieldAlert, ArrowRight, 
  CheckCircle, AlertTriangle, Send, MessageSquareX, Minus, MessageSquare, 
  Megaphone, Edit, Trash2, Save, Activity, Info, Loader, Plus, ChevronDown, Clock,
  Facebook, Youtube, UserSearch, Ban, MessageCircleWarning, Link as LinkIcon
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

const defaultLegalTexts = {
  terms: "مرحباً بك في منصة فلتر إيجيبت. بمجرد استخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية التي تنظم عملنا كمنصة إعلانات مبوبة متخصصة.\n\n1. طبيعة المنصة وإخلاء المسؤولية\nتعمل منصة فلتر إيجيبت كوسيط إلكتروني (منصة إعلانات مبوبة) يجمع بين البائعين والمشترين في مجال فلاتر المياه. نحن لا نمتلك المنتجات المعروضة، ولا نتدخل في عمليات الدفع المباشرة، ولا نقدم أي ضمانات على جودة السلع المشتراة. تقع مسؤولية فحص المنتج والتأكد من جودته بالكامل على المشتري عند الاستلام اليدوي.\n\n2. حسابك والتزاماتك\nأنت مسؤول مسؤولية كاملة عن الحفاظ على سرية بيانات حسابك وكلمة المرور. كما تلتزم بأن جميع البيانات التي قدمتها أثناء التسجيل (بما في ذلك إيصالات الدفع) هي بيانات صحيحة وقانونية. في حال ثبوت أي تلاعب، يحق للمنصة إيقاف حسابك فوراً.\n\n3. المحتوى المحظور\nيُمنع منعاً باتاً نشر إعلانات لمنتجات غير قانونية، مسروقة، أو مقلدة بشكل ينتهك حقوق الشركات الكبرى لفلاتر المياه. يمنع استخدام المنصة لنشر محتوى مسيء، خادش للحياء، أو لا يتعلق بطبيعة تخصص الموقع. الإدارة تقوم بمراجعة الإعلانات ولها الحق في حذف أي إعلان مخالف دون سابق إنذار.",
  privacy: "تلتزم فلتر إيجيبت باحترام خصوصيتك وحماية بياناتك الشخصية والتجارية بأعلى المعايير الأمنية.\n\n1. المعلومات التي نجمعها\nنقوم بجمع البيانات الأساسية اللازمة لإنشاء حسابك (الاسم، رقم الهاتف، البريد الإلكتروني، وإيصال تأكيد الاشتراك)، بالإضافة إلى أي رسائل أو تفاعلات تتم عبر نظام المحادثات الداخلي لتوفير بيئة تواصل آمنة.\n\n2. استخدام البيانات\nنستخدم بياناتك لتسهيل عمليات البيع والشراء عبر المنصة، توفير الدعم الفني لحسابك، وتحسين تجربة المستخدم. قد نستخدم رقم هاتفك للتواصل معك بشأن تحديثات حسابك أو إعلاناتك.\n\n3. مشاركة وحماية البيانات\nنحن لا نبيع أو نشارك بياناتك الشخصية مع أي جهات تسويقية خارجية بأي شكل من الأشكال. يتم حفظ بياناتك على خوادم سحابية آمنة وموثوقة.\n\n4. استثناء قانوني\nوفقاً للقوانين المصرية، قد نُضطر إلى التعاون ومشاركة معلومات محددة مع السلطات الأمنية أو الجهات الحكومية الرسمية إذا تم طلب ذلك بموجب أمر قانوني رسمي أو في حالة الإبلاغ عن عمليات نصب أو احتيال.",
  ip: "نحن في فلتر إيجيبت نحترم ونلتزم بقانون حماية حقوق الملكية الفكرية المصري رقم 82 لسنة 2002 والتعديلات اللاحقة عليه.\n\n1. حقوق فلتر إيجيبت\nإن اسم الموقع، وشعاره، والتصاميم، والأكواد البرمجية، وواجهة المستخدم، وقواعد البيانات الخاصة بالمنصة، هي ملكية فكرية حصرية لـ \"فلتر إيجيبت\". يُمنع منعاً باتاً نسخها أو اقتباسها أو إعادة إنتاجها دون إذن كتابي مسبق.\n\n2. حماية العلامات التجارية الأخرى\nيُحظر على البائعين استخدام العلامات التجارية العالمية أو المحلية لفلاتر المياه، أو الشمعات، أو قطع الغيار بطريقة مضللة للمشتري. يُمنع الترويج للمنتجات المقلدة (Copy/High Copy) على أنها أصلية واستخدام شعار الشركة الأصلية لخداع المستهلك.\n\n3. الإبلاغ عن الانتهاكات\nإذا كنت الممثل القانوني لعلامة تجارية أو شركة، ووجدت أن هناك بائعاً على منصتنا يقوم بانتهاك حقوق الملكية الفكرية الخاصة بشركتك (سواء ببيع منتجات مقلدة أو استخدام شعارك دون وجه حق)، يُرجى التواصل الفوري مع الإدارة مع تقديم الإثباتات القانونية (شهادة تسجيل العلامة التجارية أو التوكيل الرسمي). سنقوم باتخاذ إجراءات فورية قد تصل إلى حذف الإعلان وحظر المستخدم المخالف نهائياً."
};

const defaultCategoriesList = [
  'صنايعي', 'قطع غيار', 'وظائف متاحة', 'عقد عمل', 'تذاكر سفر', 'كورسات برمجة', 
  'شقق للبيع', 'شقق للايجار', 'اراضي', 'سيارات للبيع', 'سيارات للايجار', 
  'محلات للبيع', 'محلات للايجار', 'ملابس', 'احذية وشنط', 'اكسسوارات بنات', 
  'مكياج', 'دكتور نفسي', 'بلايستيشن', 'موبايلات', 'لابتوب', 'قرض حسن', 
  'كتب', 'شريك مشروع', 'عيادات', 'لوحات فنية', 'اثاث منزلي', 'اثاث مكاتب'
];

const AD_EXPIRATION_DAYS = 30; 

export default function App() {
  const [activeView, setActiveView] = useState('landing'); 
  const [pendingUsers, setPendingUsers] = useState([]);
  const [history, setHistory] = useState([]); 
  
  const [lang, setLang] = useState('ar'); 
  const [appAlert, setAppAlert] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: '', cancelText: '', type: 'danger' });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showInbox, setShowInbox] = useState(false);

  // Forms
  const [signupData, setSignupData] = useState({ fullName: '', displayName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [signupError, setSignupError] = useState('');
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [resetData, setResetData] = useState({ email: '', phone: '', newPassword: '' });
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  
  // Subscription & Settings
  const [receiptUploaded, setReceiptUploaded] = useState(false); 
  const [receiptFile, setReceiptFile] = useState(null); 
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewFile, setRenewFile] = useState(null);
  const [signupProfileImage, setSignupProfileImage] = useState(null);
  const [signupProfilePreview, setSignupProfilePreview] = useState(null);

  // Edit Profile States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editYoutube, setEditYoutube] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null); 
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // New Features States
  const [viewedProfile, setViewedProfile] = useState(null);
  const [directorySearch, setDirectorySearch] = useState('');
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [adminComplaints, setAdminComplaints] = useState([]);

  // Banner Ads States
  const [banners, setBanners] = useState([]);
  const [newBannerImage, setNewBannerImage] = useState(null);
  const [newBannerLink, setNewBannerLink] = useState('');

  // Admin Search States
  const [adminPendingSearch, setAdminPendingSearch] = useState('');
  const [adminMembersSearch, setAdminMembersSearch] = useState('');

  // Categories & Ads
  const [categories, setCategories] = useState(defaultCategoriesList);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sellerInput, setSellerInput] = useState(''); 
  const [adCategory, setAdCategory] = useState('');
  const [showAdCategoryMenu, setShowAdCategoryMenu] = useState(false);
  const [filterCategory, setFilterCategory] = useState('الكل');
  const [uploadedImages, setUploadedImages] = useState([]); 
  const [selectedAd, setSelectedAd] = useState(null); 
  const [detailsImageIdx, setDetailsImageIdx] = useState(0); 

  const [adToEdit, setAdToEdit] = useState(null);
  const [editNewImages, setEditNewImages] = useState([]); 

  const [globalAds, setGlobalAds] = useState([]);
  const [liveBroadcastAds, setLiveBroadcastAds] = useState([]); 
  const isInitialAdsLoad = useRef(true);

  // Users & Auth
  const [fbUser, setFbUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAppLoggedIn, setIsAppLoggedIn] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);

  // Chats
  const [globalChats, setGlobalChats] = useState([]);
  const prevChatsRef = useRef({});
  const [openChatIds, setOpenChatIds] = useState([]); 
  const [activeChatId, setActiveChatId] = useState(null); 
  const [unreadCounts, setUnreadCounts] = useState({});
  const [chatPositions, setChatPositions] = useState({}); 
  const [chatInputs, setChatInputs] = useState({}); 
  const [isDragging, setIsDragging] = useState(false);
  
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, adId: null });
  const chatMessagesEndRef = useRef(null);
  const activeChatRef = useRef(null);

  const [legalTexts, setLegalTexts] = useState(defaultLegalTexts);
  const [legalEditModal, setLegalEditModal] = useState({ isOpen: false, type: '', content: '', title: '' });

  const AD_EXPIRATION_MS = AD_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const liveFeedAds = globalAds.filter(ad => ad.statusEn === 'Active' && (now - ad.createdAt) < AD_EXPIRATION_MS);
  const myAds = globalAds.filter(ad => ad.sellerId === userProfile?.uid);
  const expiredAdminAds = globalAds.filter(ad => (now - ad.createdAt) >= AD_EXPIRATION_MS);

  // Auth Init
  useEffect(() => {
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (error) { console.error('Auth Error:', error); } };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => { setFbUser(user); });
    return () => unsubscribe();
  }, []);

  // Fetch Profile
  useEffect(() => {
    if (!fbUser) return;
    const fetchProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'users', fbUser.uid));
        if (docSnap.exists()) { 
           if (docSnap.data().isBanned) {
              setAppAlert('عذراً، هذا الحساب تم حظره من قبل الإدارة.');
              setIsAppLoggedIn(false);
              setUserProfile(null);
              return;
           }
           setUserProfile(docSnap.data()); 
           setIsAppLoggedIn(true); 
        }
      } catch (error) { console.error(error); }
    };
    fetchProfile();
  }, [fbUser]);

  // Sync Profiles
  useEffect(() => {
    if (!fbUser) return;
    const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const profs = [];
      snapshot.forEach(doc => profs.push({ uid: doc.id, ...doc.data() }));
      setAllProfiles(profs);
    }, (error) => console.error("Profiles error:", error));
    return () => unsubscribe();
  }, [fbUser]);

  // Sync Complaints (Admin)
  useEffect(() => {
    if (!fbUser) return;
    const unsubscribe = onSnapshot(collection(db, 'complaints'), (snapshot) => {
      const comps = [];
      snapshot.forEach(doc => comps.push({ id: doc.id, ...doc.data() }));
      comps.sort((a, b) => b.createdAt - a.createdAt);
      setAdminComplaints(comps);
    }, (error) => console.log("Complaints rule might be missing, ignoring if not admin."));
    return () => unsubscribe();
  }, [fbUser]);

  // Sync Ads
  useEffect(() => {
    if (!fbUser) return;
    const unsubscribe = onSnapshot(collection(db, 'ads'), (snapshot) => {
      const adsList = [];
      snapshot.forEach(doc => adsList.push({ id: doc.id, ...doc.data() }));
      adsList.sort((a, b) => b.createdAt - a.createdAt);
      setGlobalAds(adsList);

      if (!isInitialAdsLoad.current) {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added' && change.doc.data().statusEn === 'Active') triggerLiveBroadcast({ id: change.doc.id, ...change.doc.data() });
        });
      } else { isInitialAdsLoad.current = false; }
    }, (error) => console.error(error));
    return () => unsubscribe();
  }, [fbUser]);

  // Sync Chats
  useEffect(() => {
    if (!fbUser || !userProfile?.uid) return; 
    const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', userProfile.uid));
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const newChats = [];
      snapshot.forEach(d => newChats.push({ id: d.id, ...d.data() }));
      newChats.sort((a,b) => b.updatedAt - a.updatedAt);
      
      newChats.forEach(chat => {
        if (chat.participants?.includes(userProfile?.uid)) {
            const prevChat = prevChatsRef.current[chat.id];
            const isNewMessage = prevChat && chat.messages?.length > prevChat.messages?.length;
            const lastMsg = chat.messages?.[chat.messages.length - 1];
            
            if (isNewMessage && lastMsg?.senderId !== userProfile?.uid) {
                setOpenChatIds(prev => prev.includes(chat.id) ? prev : [...prev, chat.id]);
                if (activeChatRef.current !== chat.id) setUnreadCounts(prev => ({ ...prev, [chat.id]: (prev[chat.id] || 0) + 1 }));
            }
        }
        prevChatsRef.current[chat.id] = chat;
      });
      setGlobalChats(newChats);
    }, (error) => console.error(error));
    return () => unsubscribe();
  }, [fbUser, userProfile?.uid]);

  // Sync Banners
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'banners'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().list) setBanners(docSnap.data().list);
      else setBanners([]);
    }, (error) => console.log("Banners sync issue, ignoring."));
    return () => unsub();
  }, []);

  // Scroll to bottom
  useEffect(() => {
    activeChatRef.current = activeChatId;
    if (activeChatId) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCounts(prev => ({ ...prev, [activeChatId]: 0 }));
    }
  }, [activeChatId, globalChats]);

  // Sync Categories & Legal
  useEffect(() => {
    const unsubscribeLegal = onSnapshot(doc(db, 'settings', 'legal'), (docSnap) => {
      if (docSnap.exists()) setLegalTexts(docSnap.data());
      else setLegalTexts(defaultLegalTexts);
    });
    const unsubscribeCategories = onSnapshot(doc(db, 'settings', 'categories'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().list) setCategories(docSnap.data().list);
    });
    return () => { unsubscribeLegal(); unsubscribeCategories(); };
  }, []);

  useEffect(() => {
    if (categories.length > 0 && (!adCategory || !categories.includes(adCategory))) setAdCategory(categories[0]);
  }, [categories, adCategory]);

  useEffect(() => {
    if (showSettingsModal && userProfile) {
      setEditName(userProfile.displayName || '');
      setEditPhone(userProfile.phone || '');
      setEditBio(userProfile.bio || '');
      setEditFacebook(userProfile.facebookUrl || '');
      setEditYoutube(userProfile.youtubeUrl || '');
    }
  }, [showSettingsModal, userProfile]);

  let subStatus = 'active'; let subDaysLeft = 0;
  if (userProfile?.subscriptionStatus === 'Active' && userProfile.activatedAt) {
     const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
     const timeElapsed = Date.now() - userProfile.activatedAt;
     const timeLeft = thirtyDaysMs - timeElapsed;
     if (timeLeft <= 0) subStatus = 'expired';
     else if (timeLeft <= (5 * 24 * 60 * 60 * 1000)) { subStatus = 'warning'; subDaysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24)); }
  }

  // Admin Categories
  const handleAddCategory = async () => {
    if (!newCategoryInput.trim()) return;
    const newCat = newCategoryInput.trim();
    if (categories.includes(newCat)) { setAppAlert('هذا القسم موجود بالفعل!'); return; }
    const updated = [...categories, newCat];
    setCategories(updated); setNewCategoryInput(''); setIsUploading(true);
    try { await setDoc(doc(db, 'settings', 'categories'), { list: updated }, { merge: true }); setAppAlert('تم إضافة القسم بنجاح'); } catch(e) { console.error(e); } setIsUploading(false);
  };

  const handleDeleteCategory = (catToRemove) => {
    setConfirmModal({
      isOpen: true, title: 'تأكيد الحذف', message: `هل أنت متأكد من حذف قسم "${catToRemove}" نهائياً؟`, confirmText: 'نعم، احذف', type: 'danger',
      onConfirm: async () => { setConfirmModal({ ...confirmModal, isOpen: false }); setIsUploading(true); try { const updated = categories.filter(c => c !== catToRemove); setCategories(updated); await setDoc(doc(db, 'settings', 'categories'), { list: updated }, { merge: true }); setAppAlert('تم حذف القسم بنجاح'); } catch(e) {} setIsUploading(false); }
    });
  };

  const saveLegalDocument = async () => {
    setIsUploading(true);
    try { await setDoc(doc(db, 'settings', 'legal'), { ...legalTexts, [legalEditModal.type]: legalEditModal.content }, { merge: true }); setLegalEditModal({ isOpen: false, type: '', content: '', title: '' }); setAppAlert('تم تحديث الصفحة بنجاح وحفظها في قاعدة البيانات!'); } catch(err) {} setIsUploading(false);
  };

  // Admin Banners
  const handleAddBanner = async () => {
    if (!newBannerImage) { setAppAlert('يرجى اختيار صورة البنر الإعلاني أولاً.'); return; }
    setIsUploading(true);
    try {
       const formData = new FormData(); formData.append('image', newBannerImage);
       const res = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formData });
       if(res.ok) {
          const url = (await res.json()).data.url;
          const newBanner = { id: Date.now().toString(), imageUrl: url, link: newBannerLink };
          const updatedBanners = [...banners, newBanner];
          await setDoc(doc(db, 'settings', 'banners'), { list: updatedBanners }, { merge: true });
          setAppAlert('تم رفع البنر وإضافته بنجاح!');
          setNewBannerImage(null);
          setNewBannerLink('');
       } else { throw new Error('Network error'); }
    } catch(e) { console.error(e); setAppAlert('خطأ أثناء رفع البنر الإعلاني.'); }
    setIsUploading(false);
  };

  const handleDeleteBanner = async (bannerId) => {
    setIsUploading(true);
    try {
       const updatedBanners = banners.filter(b => b.id !== bannerId);
       await setDoc(doc(db, 'settings', 'banners'), { list: updatedBanners }, { merge: true });
       setAppAlert('تم إزالة البنر بنجاح!');
    } catch(e) { setAppAlert('خطأ أثناء إزالة البنر.'); }
    setIsUploading(false);
  };

  const renderLegalText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2"></div>;
      if (/^\d+\./.test(line.trim())) return <h3 key={i} className="text-xl font-bold text-emerald-400 mt-8 mb-2">{line}</h3>;
      return <p key={i} className="mb-2">{line}</p>;
    });
  };

  // AD EDITING
  const saveAdEdit = async () => {
    if (!adToEdit.title || !adToEdit.price) { setAppAlert('يرجى ملء العنوان والسعر.'); return; }
    setIsUploading(true);
    try {
      const finalImageUrls = [...(adToEdit.images || [])];
      for (const item of editNewImages) {
        if (item.file) {
          try {
            const formData = new FormData(); formData.append('image', item.file);
            const res = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formData });
            if (res.ok) { const imgData = await res.json(); finalImageUrls.push(imgData.data.url); }
          } catch (err) { }
        }
      }
      if (finalImageUrls.length === 0) finalImageUrls.push("https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800");
      await updateDoc(doc(db, 'ads', adToEdit.id), { title: adToEdit.title, titleEn: adToEdit.title, price: adToEdit.price, category: adToEdit.category, description: adToEdit.description || '', images: finalImageUrls });
      setAppAlert('تم تعديل الإعلان والصور بنجاح!'); setAdToEdit(null); setEditNewImages([]);
    } catch (err) {} setIsUploading(false);
  };

  // SIGNUP
  const handleSignupSubmit = async () => {
    setSignupError(''); setIsUploading(true); 
    try {
      if (!signupData.fullName || !signupData.displayName || !signupData.email || !signupData.phone || !signupData.password) throw new Error('يرجى ملء كافة البيانات');
      if (signupData.password !== signupData.confirmPassword) throw new Error('كلمات المرور غير متطابقة');
      if (!receiptUploaded || !receiptFile) throw new Error('يرجى إرفاق صورة إيصال الدفع للتحقق');

      const cleanEmail = signupData.email.trim().toLowerCase();
      const cleanPhone = signupData.phone.trim();
      if (allProfiles.some(p => p.email === cleanEmail)) throw new Error('البريد الإلكتروني مستخدم بالفعل');
      if (allProfiles.some(p => p.phone === cleanPhone)) throw new Error('رقم الهاتف مستخدم بالفعل');

      let photoUrl = null;
      if (signupProfileImage) {
          const formProfile = new FormData(); formProfile.append('image', signupProfileImage);
          const resProfile = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formProfile });
          if(resProfile.ok) { const dpData = await resProfile.json(); photoUrl = dpData.data.url; }
      }

      let receiptUrl = '';
      const formData = new FormData(); formData.append('image', receiptFile);
      const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formData });
      if (imgbbResponse.ok) { receiptUrl = (await imgbbResponse.json()).data.url; } else { throw new Error('حدث خطأ بالشبكة'); }

      const newUid = fbUser ? fbUser.uid : Date.now().toString(); 
      const newProfile = { uid: newUid, fullName: signupData.fullName, displayName: signupData.displayName, email: cleanEmail, phone: cleanPhone, password: signupData.password, subscriptionStatus: 'Pending', createdAt: new Date().toISOString(), receiptUrl: receiptUrl, photoUrl: photoUrl, bio: '', facebookUrl: '', youtubeUrl: '', isBanned: false };
      await setDoc(doc(db, 'users', newUid), newProfile); await setDoc(doc(db, 'profiles', newUid), newProfile);
      setAppAlert('تم إرسال طلبك بنجاح! بانتظار المراجعة.'); setTimeout(() => { window.location.reload(); }, 3500);
    } catch (error) { setSignupError(error.message || 'حدث خطأ أثناء التسجيل'); } finally { setIsUploading(false); }
  };

  const handleRenewSubmit = async () => {
    if (!renewFile) return; setIsUploading(true);
    try {
       const formData = new FormData(); formData.append('image', renewFile);
       const res = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formData });
       if(res.ok) {
          const url = (await res.json()).data.url;
          await updateDoc(doc(db, 'users', userProfile.uid), { subscriptionStatus: 'Pending', receiptUrl: url });
          await updateDoc(doc(db, 'profiles', userProfile.uid), { subscriptionStatus: 'Pending', receiptUrl: url });
          setAppAlert('تم إرسال طلب التجديد بنجاح!'); setShowRenewModal(false); setUserProfile({...userProfile, subscriptionStatus: 'Pending', receiptUrl: url});
       }
    } catch(e) {} setIsUploading(false);
  };

  const handleLoginSubmit = async () => {
    setLoginError('');
    if (!loginData.identifier || !loginData.password) { setLoginError('يرجى إدخال البيانات'); return; }
    try {
      const usersRef = collection(db, 'profiles'); let foundUser = null;
      const searchIdentifier = loginData.identifier.trim().toLowerCase();
      const emailSnap = await getDocs(query(usersRef, where('email', '==', searchIdentifier)));
      if (!emailSnap.empty) { foundUser = emailSnap.docs.map(d => d.data()).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0]; 
      } else {
        const phoneSnap = await getDocs(query(usersRef, where('phone', '==', loginData.identifier.trim())));
        if (!phoneSnap.empty) { foundUser = phoneSnap.docs.map(d => d.data()).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0]; }
      }

      if (foundUser) {
        if (foundUser.isBanned) { setLoginError('عذراً، هذا الحساب تم حظره من الإدارة.'); return; }
        if (foundUser.password === loginData.password) { setUserProfile(foundUser); setIsAppLoggedIn(true); setLoginData({ identifier: '', password: '' }); navigateTo('landing');
        } else { setLoginError('كلمة المرور غير صحيحة'); }
      } else { setLoginError('الحساب غير موجود'); }
    } catch (error) { setLoginError('خطأ في النظام'); }
  };

  const handlePasswordReset = async () => {
    setResetError(''); setResetSuccess('');
    if (!resetData.email || !resetData.phone || !resetData.newPassword) { setResetError('يرجى ملء كافة البيانات'); return; }
    try {
      const snap = await getDocs(query(collection(db, 'profiles'), where('email', '==', resetData.email), where('phone', '==', resetData.phone)));
      if (!snap.empty) {
        const uid = snap.docs[0].id;
        await updateDoc(doc(db, 'users', uid), { password: resetData.newPassword }); await updateDoc(doc(db, 'profiles', uid), { password: resetData.newPassword });
        setResetSuccess('تم تغيير كلمة المرور بنجاح!'); setTimeout(() => { setActiveView('login'); setResetData({ email: '', phone: '', newPassword: '' }); setResetSuccess(''); }, 3000);
      } else { setResetError('البيانات غير صحيحة'); }
    } catch (error) { setResetError('حدث خطأ'); }
  };

  const handleLogout = () => { setIsAppLoggedIn(false); setUserProfile(null); setOpenChatIds([]); setActiveChatId(null); navigateTo('login'); };

  const submitComplaint = async () => {
    if (!complaintText.trim() || !userProfile) return;
    setIsUploading(true);
    try {
       await setDoc(doc(db, 'complaints', Date.now().toString()), {
          senderId: userProfile.uid, senderName: userProfile.displayName, text: complaintText, createdAt: Date.now(), phone: userProfile.phone
       });
       setAppAlert('تم إرسال رسالتك للإدارة بنجاح. شكراً لتواصلك معنا.');
       setComplaintText(''); setShowComplaintModal(false);
    } catch (err) { console.error(err); setAppAlert('حدث خطأ. تأكد من إعدادات الـ Rules.'); }
    setIsUploading(false);
  };

  const openChat = async (adOrProfileId, titleFallback) => {
    if (!isAppLoggedIn || !userProfile) { setAppAlert('يرجى تسجيل الدخول أولاً.'); return; }
    const targetSellerId = typeof adOrProfileId === 'object' ? adOrProfileId.sellerId : adOrProfileId;
    const targetTitle = typeof adOrProfileId === 'object' ? adOrProfileId.title : titleFallback;
    const adIdRef = typeof adOrProfileId === 'object' ? adOrProfileId.id : `direct_${targetSellerId}`;

    if (userProfile.uid === targetSellerId) { setAppAlert('لا يمكنك مراسلة نفسك!'); return; }
    
    const chatId = `${adIdRef}_${userProfile.uid}_${targetSellerId}`;
    const existingChat = globalChats.find(c => c.id === chatId);
    if (!existingChat) { await setDoc(doc(db, 'chats', chatId), { adId: adIdRef, adTitle: targetTitle, participants: [userProfile.uid, targetSellerId], buyerId: userProfile.uid, sellerId: targetSellerId, messages: [], updatedAt: Date.now() }); }
    if (!openChatIds.includes(chatId)) setOpenChatIds(prev => [...prev, chatId]);
    setActiveChatId(chatId);
    if (!chatPositions[chatId]) setChatPositions(prev => ({ ...prev, [chatId]: { x: window.innerWidth > 768 ? (window.innerWidth / 2) - 190 : 10, y: window.innerHeight > 768 ? (window.innerHeight / 2) - 275 : 10 } }));
  };

  const handleSendMessage = async () => {
    const currentInput = chatInputs[activeChatId] || '';
    if(currentInput.trim() === '' || !activeChatId || !userProfile) return;
    const activeChat = globalChats.find(c => c.id === activeChatId); if (!activeChat) return;
    const newMsg = { text: currentInput, senderId: userProfile.uid, timestamp: Date.now(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setChatInputs(prev => ({...prev, [activeChatId]: ''}));
    try { await updateDoc(doc(db, 'chats', activeChatId), { messages: [...(activeChat.messages || []), newMsg], updatedAt: Date.now() }); } catch (error) {}
  };

  const handleMouseDown = (e, adId) => { if (e.target.closest('button')) return; setIsDragging(true); dragRef.current = { startX: e.clientX, startY: e.clientY, initialX: chatPositions[adId]?.x || 0, initialY: chatPositions[adId]?.y || 0, adId: adId }; };

  useEffect(() => {
    const handleMouseMove = (e) => { if (!isDragging || !dragRef.current.adId) return; setChatPositions(prev => ({ ...prev, [dragRef.current.adId]: { x: dragRef.current.initialX + (e.clientX - dragRef.current.startX), y: dragRef.current.initialY + (e.clientY - dragRef.current.startY) } })); };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isDragging]);

  const triggerLiveBroadcast = (ad) => { setLiveBroadcastAds(prev => [ad, ...prev].slice(0, 3)); setTimeout(() => setLiveBroadcastAds(prev => prev.filter(a => a.id !== ad.id)), 5000); };

  const handleImageUpload = (e) => { if (e.target.files && e.target.files.length > 0) { const newImages = Array.from(e.target.files).map(file => ({ file: file, preview: URL.createObjectURL(file) })); setUploadedImages(prev => [...prev, ...newImages]); } };
  const removeUploadedImage = (indexToRemove) => setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  const handleProfileImageUpload = async (e) => { if (e.target.files && e.target.files[0]) { setProfileImagePreview(URL.createObjectURL(e.target.files[0])); setProfileImageFile(e.target.files[0]); } };

  const saveProfileUpdates = async () => {
    if (!isAppLoggedIn || !userProfile) return; setIsUploading(true);
    try {
      let newPhotoUrl = userProfile.photoUrl || null;
      if (profileImageFile) {
        const formData = new FormData(); formData.append('image', profileImageFile);
        const res = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formData });
        if (res.ok) { newPhotoUrl = (await res.json()).data.url; }
      }
      const updatedProfile = { ...userProfile, displayName: editName, phone: editPhone, photoUrl: newPhotoUrl, bio: editBio, facebookUrl: editFacebook, youtubeUrl: editYoutube };
      await updateDoc(doc(db, 'users', userProfile.uid), updatedProfile); await updateDoc(doc(db, 'profiles', userProfile.uid), updatedProfile); 
      setUserProfile(updatedProfile); setAppAlert('تم تحديث الملف الشخصي بنجاح!'); setShowSettingsModal(false);
    } catch (error) { setAppAlert('خطأ أثناء تحديث الملف الشخصي.'); } finally { setIsUploading(false); }
  };

  const viewAdDetails = async (ad) => {
    setSelectedAd(ad); setDetailsImageIdx(0); navigateTo('ad-details');
    if (isAppLoggedIn && userProfile && ad.sellerId !== userProfile.uid && ad.id !== 'dummy-1') { try { await updateDoc(doc(db, 'ads', ad.id), { views: (ad.views || 0) + 1 }); } catch (e) {} }
  };

  const navigateTo = (view) => { if (view === 'landing') { setHistory([]); setActiveView('landing'); } else { setHistory(prev => [...prev, activeView]); setActiveView(view); } };
  const goBack = () => { setHistory(prev => { const newHistory = [...prev]; const previous = newHistory.pop() || 'landing'; setActiveView(previous); return newHistory; }); };

  const bgColor = "bg-[#111827]"; const cardBg = "bg-[#1f2937]"; const accentColor = "text-emerald-400"; const accentBg = "bg-emerald-500 hover:bg-emerald-600";
  const myActiveChats = globalChats.filter(c => c.participants?.includes(userProfile?.uid));
  const dockedChats = myActiveChats.filter(c => c.id !== activeChatId && openChatIds.includes(c.id));
  const activeChat = globalChats.find(c => c.id === activeChatId);
  const totalMembers = allProfiles.length > 0 ? allProfiles.length : 1; 
  const onlineMembers = Math.max(1, Math.floor(totalMembers * 0.4)); 
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  const AvatarFallback = ({ size = 16, className = "" }) => (
    <div className={`bg-gray-700 flex items-center justify-center rounded-full shrink-0 ${className}`} style={{ width: size, height: size }}>
      <User size={size * 0.6} className="text-gray-400" />
    </div>
  );

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen ${bgColor} text-gray-100 font-sans flex flex-col items-center justify-between relative`}>
      
      {/* إشعارات الرادار المباشر */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] flex flex-col gap-3 w-[90%] max-w-sm pointer-events-none">
        {liveBroadcastAds.map(ad => (
           <div key={ad.id + Math.random()} className="bg-[#1f2937] border-l-4 border-red-500 p-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in pointer-events-auto cursor-pointer" onClick={() => viewAdDetails(ad)}>
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-700">
                <img src={ad.images?.[0]} className="w-full h-full object-cover" alt="Radar Ad" />
                <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-red-400 font-bold mb-1 flex items-center gap-1.5"><Radio size={14} className="animate-pulse"/> {lang==='ar'?'رادار مباشر - إعلان جديد':'Live Radar - New Ad'}</p>
                <p className="text-white text-sm font-bold truncate pr-2">{lang==='ar'?ad.title:ad.titleEn}</p>
              </div>
           </div>
        ))}
      </div>

      {isUploading && ( <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in"><Loader className="text-emerald-500 animate-spin mb-4" size={64} /><h2 className="text-xl font-bold text-white mb-2">جاري معالجة البيانات...</h2></div> )}
      {appAlert && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className={`${cardBg} border border-emerald-500/50 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl text-center`}>
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"><Info size={32} /></div>
            <h3 className="text-xl font-bold text-white mb-2">إشعار النظام</h3><p className="text-gray-300 text-sm mb-6 leading-relaxed">{appAlert}</p>
            <button onClick={() => setAppAlert(null)} className={`w-full ${accentBg} text-white font-bold rounded-xl py-3`}>حسناً، فهمت</button>
          </div>
        </div>
      )}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[350] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1f2937] rounded-3xl p-6 w-full max-w-sm text-center relative shadow-2xl border border-gray-700">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmModal.type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-400'}`}><AlertTriangle size={32} /></div>
             <h3 className="text-xl font-bold mb-2 text-white">{confirmModal.title}</h3><p className="text-gray-400 mb-6 text-sm">{confirmModal.message}</p>
             <div className="flex gap-4"><button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors">{confirmModal.cancelText || 'إلغاء'}</button><button onClick={confirmModal.onConfirm} className={`flex-1 text-white py-3 rounded-xl font-bold transition-colors ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-500 hover:bg-emerald-600'}`}>{confirmModal.confirmText || 'تأكيد'}</button></div>
          </div>
        </div>
      )}

      {/* --- COMPLAINT MODAL --- */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1f2937] rounded-3xl p-8 w-full max-w-md relative shadow-2xl border border-gray-700">
             <button onClick={() => setShowComplaintModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-white"><X/></button>
             <h3 className="text-2xl font-bold mb-4 text-emerald-400 text-center flex items-center justify-center gap-2"><MessageCircleWarning size={28}/> تواصل مع الإدارة</h3>
             <p className="text-center text-gray-400 mb-6 text-sm">اكتب اقتراحك أو الشكوى الخاصة بك وسيقوم الدعم الفني بمراجعتها بأقرب وقت.</p>
             <textarea rows="5" value={complaintText} onChange={e => setComplaintText(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500 resize-none mb-4" placeholder="اكتب رسالتك هنا..."></textarea>
             <button onClick={submitComplaint} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">إرسال الرسالة للإدارة</button>
          </div>
        </div>
      )}

      {/* --- EDIT AD MODAL --- */}
      {adToEdit && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1f2937] rounded-3xl p-6 md:p-8 w-full max-w-lg relative shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
             <button onClick={() => { setAdToEdit(null); setEditNewImages([]); }} className="absolute top-4 left-4 text-gray-400 hover:text-white"><X/></button>
             <h3 className="text-2xl font-bold mb-6 text-emerald-400 text-center">{lang === 'ar' ? 'تعديل الإعلان' : 'Edit Ad'}</h3>
             
             <div className="space-y-4">
               <div><label className="block text-gray-400 text-sm mb-1">{lang === 'ar' ? 'عنوان الإعلان' : 'Ad Title'}</label><input type="text" value={adToEdit.title} onChange={e => setAdToEdit({...adToEdit, title: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" /></div>
               <div><label className="block text-gray-400 text-sm mb-1">{lang === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)'}</label><input type="text" value={adToEdit.price} onChange={e => setAdToEdit({...adToEdit, price: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" /></div>
               <div><label className="block text-gray-400 text-sm mb-1">{lang === 'ar' ? 'القسم' : 'Category'}</label><select value={adToEdit.category || categories[0]} onChange={e => setAdToEdit({...adToEdit, category: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 cursor-pointer">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
               <div><label className="block text-gray-400 text-sm mb-1">{lang === 'ar' ? 'وصف الإعلان والمواصفات' : 'Ad Description'}</label><textarea rows="4" value={adToEdit.description || ''} onChange={e => setAdToEdit({...adToEdit, description: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-none custom-scrollbar" placeholder="اكتب التفاصيل هنا..."></textarea></div>
               <div>
                 <label className="block text-gray-400 text-sm mb-2">{lang === 'ar' ? 'صور الإعلان (حذف أو إضافة)' : 'Ad Images (Remove or Add)'}</label>
                 <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {adToEdit.images?.map((url, idx) => ( <div key={`old-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-600 group"><img src={url} alt="Old Ad" className="w-full h-full object-cover" /><button onClick={() => setAdToEdit({...adToEdit, images: adToEdit.images.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"><X size={12}/></button></div> ))}
                    {editNewImages.map((imgObj, idx) => ( <div key={`new-${idx}`} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-500/50"><img src={imgObj.preview} alt="New Upload" className="w-full h-full object-cover" /><button onClick={() => setEditNewImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X size={12}/></button></div> ))}
                    <label className="cursor-pointer bg-[#111827] flex flex-col items-center justify-center w-20 h-20 shrink-0 rounded-xl border border-dashed border-gray-600 hover:border-emerald-500 text-gray-500 hover:text-emerald-400 transition-colors"><Plus size={24} /><span className="text-[10px] mt-1 font-bold">إضافة صورة</span><input type="file" multiple className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) { setEditNewImages(prev => [...prev, ...Array.from(e.target.files).map(file => ({ file, preview: URL.createObjectURL(file) }))]); } }} accept="image/*" /></label>
                 </div>
               </div>
               <button onClick={saveAdEdit} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 mt-6 transition-colors shadow-lg shadow-emerald-500/20">{lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</button>
             </div>
          </div>
        </div>
      )}

      {/* --- RENEW SUBSCRIPTION MODAL --- */}
      {showRenewModal && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1f2937] rounded-3xl p-8 w-full max-w-md relative shadow-2xl border border-gray-700">
             <button onClick={() => setShowRenewModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-white"><X/></button>
             <h3 className="text-2xl font-bold mb-6 text-emerald-400 text-center">تجديد الاشتراك الشهري</h3>
             <p className="text-center text-gray-300 mb-6 text-sm leading-relaxed">يرجى تحويل مبلغ 10 جنيهات لرسوم الاشتراك الشهري وإرفاق الإيصال هنا ليتم تفعيل حسابك مرة أخرى.</p>
             <label className="border border-dashed border-gray-600 p-6 rounded-xl text-center cursor-pointer block text-gray-400 hover:border-emerald-500 transition-colors mb-6"><Upload className="mx-auto mb-2" /> {renewFile ? 'تم اختيار إيصال التجديد بنجاح' : 'إرفاق إيصال التجديد (10 جنيه)'}<input type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files[0]) { setRenewFile(e.target.files[0]); } }} /></label>
             <button onClick={handleRenewSubmit} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg">إرسال طلب التجديد</button>
          </div>
        </div>
      )}

      <header className="w-full max-w-6xl mx-auto p-4 md:p-6 flex justify-between items-center gap-4 border-b border-gray-800/50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('landing')}>
          <div className="relative w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-gray-700 group-hover:border-emerald-500 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CE1126] via-white to-black animate-flag-wave bg-[length:200%_200%] opacity-90"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            <Filter className="relative z-10 text-[#C09300] drop-shadow-md" size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center hidden sm:flex">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-none text-white">فلتر <span className={accentColor}>إيجيبت</span></h1>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] mt-1 uppercase font-mono">Filter Egypt</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs text-gray-400 font-medium bg-[#1f2937]/50 px-6 py-2 rounded-full border border-gray-800">
          <div className="flex items-center gap-2"><Radio size={14} className="text-emerald-500 animate-pulse" />{lang === 'ar' ? 'متصل الآن:' : 'Online:'} <span className="text-white font-bold text-sm">{onlineMembers}</span></div>
          <div className="w-px h-4 bg-gray-700"></div>
          <div className="flex items-center gap-2"><Users size={14} className="text-blue-400" />{lang === 'ar' ? 'الأعضاء:' : 'Members:'} <span className="text-white font-bold text-sm">{totalMembers}</span></div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          {isAppLoggedIn && (
            <div className="flex gap-2">
               {(showInbox || showNotifications) && (<div className="fixed inset-0 z-40" onClick={() => { setShowInbox(false); setShowNotifications(false); }}></div>)}
               <div className="relative z-50">
                  <button onClick={() => { setShowInbox(!showInbox); setShowNotifications(false); }} className="text-gray-400 hover:text-white relative p-2 bg-[#1f2937] rounded-full border border-gray-700 hover:border-emerald-500 transition-colors"><MessageSquare size={18} /></button>
                  {showInbox && (
                    <div className="absolute left-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-3 w-72 bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in max-h-96 overflow-y-auto custom-scrollbar">
                       <h4 className="text-sm font-bold text-gray-400 mb-2 px-3 border-b border-gray-700 pb-3 mt-2">{lang === 'ar' ? 'الرسائل (صندوق الوارد)' : 'Inbox'}</h4>
                       {myActiveChats.length === 0 ? (<p className="text-xs text-gray-500 text-center py-6">لا توجد محادثات سابقة</p>) : (
                          myActiveChats.map(c => (
                             <div key={c.id} onClick={() => { if (!openChatIds.includes(c.id)) setOpenChatIds(prev => [...prev, c.id]); setActiveChatId(c.id); setShowInbox(false); }} className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0"><User size={18} /></div>
                                <div className="flex-1 overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}><p className="text-sm text-white font-bold truncate">{c.adTitle}</p><p className="text-xs text-gray-400 truncate">{c.messages?.[c.messages.length - 1]?.text || 'بدء المحادثة...'}</p></div>
                             </div>
                          ))
                       )}
                    </div>
                  )}
               </div>
               <div className="relative z-50">
                  <button onClick={() => { setShowNotifications(!showNotifications); setShowInbox(false); }} className="text-gray-400 hover:text-white relative p-2 bg-[#1f2937] rounded-full border border-gray-700 hover:border-emerald-500 transition-colors">
                     <Bell size={18} />{totalUnread > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111827] rounded-full animate-ping"></span>}{totalUnread > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#111827] rounded-full"></span>}
                  </button>
                  {showNotifications && (
                    <div className="absolute left-0 sm:right-0 mt-3 w-72 bg-[#1f2937] border border-gray-700 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in">
                       <h4 className="text-sm font-bold text-gray-400 mb-2 px-3 border-b border-gray-700 pb-3 mt-2">الإشعارات الجديدة</h4>
                       {globalChats.filter(c => unreadCounts[c.id] > 0).map(c => (
                          <div key={c.id} onClick={() => { if (!openChatIds.includes(c.id)) setOpenChatIds(prev => [...prev, c.id]); setActiveChatId(c.id); setShowNotifications(false); }} className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0"><MessageSquare size={18} /></div>
                            <div className="flex-1 overflow-hidden"><p className="text-sm text-white font-bold">رسالة جديدة</p><p className="text-xs text-gray-400 truncate w-full">{c.adTitle}</p></div>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{unreadCounts[c.id]}</span>
                          </div>
                       ))}
                       {totalUnread === 0 && <p className="text-xs text-gray-500 text-center py-6">لا توجد إشعارات جديدة</p>}
                    </div>
                  )}
               </div>
            </div>
          )}
          
          {isAppLoggedIn ? (
             <div className="flex items-center gap-3">
               {userProfile?.subscriptionStatus === 'Pending' ? (
                 <span className="text-yellow-500 font-bold text-xs md:text-sm hidden sm:flex bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 items-center gap-1.5"><AlertTriangle size={14} className="animate-pulse" /> قيد المراجعة</span>
               ) : (
                 <span className="text-emerald-400 font-bold text-xs md:text-sm hidden sm:flex bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 items-center gap-2">
                   {userProfile?.photoUrl ? <img src={userProfile.photoUrl} alt="profile" className="w-6 h-6 rounded-full object-cover" /> : <AvatarFallback size={24} />} 
                   {userProfile?.displayName || 'مستخدم'}
                 </span>
               )}
               <button onClick={handleLogout} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold">خروج</button>
             </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => navigateTo('login')} className={`bg-[#1f2937] border border-gray-700 text-white px-4 py-2 rounded-full font-semibold text-xs md:text-sm`}>دخول</button>
              <button onClick={() => navigateTo('signup')} className={`${accentBg} text-white px-4 py-2 rounded-full font-semibold flex items-center gap-1.5 text-xs md:text-sm`}><UserPlus size={16} /> <span className="hidden sm:inline">اشتراك</span></button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col justify-center items-center px-4 mt-8 md:mt-0 pb-10">
        
        {activeView === 'landing' && (
          <div className="w-full animate-fade-in flex flex-col items-center mt-6 w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight text-center">مجتمع حصري <span className={accentColor}>للأعضاء فقط</span></h2>
            <p className="text-gray-400 text-base md:text-lg mb-12 max-w-2xl leading-relaxed text-center">بيئة مميزة للجودة والثقة باشتراك رمزي (10 جنيهات شهرياً). بيع وشراء بأمان بعيداً عن فوضى السوق والتشتت.</p>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center">
              <div onClick={() => isAppLoggedIn ? setActiveView('seller') : navigateTo('login')} className={`${cardBg} flex-1 p-8 rounded-3xl border border-gray-700 hover:border-emerald-500 cursor-pointer group flex flex-col items-center gap-4`}>
                <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-emerald-500/20 flex items-center justify-center"><Store className="text-gray-400 group-hover:text-emerald-400" size={32} /></div>
                <h3 className="text-xl font-bold text-white">أنا البائع</h3>
                <p className="text-gray-400 text-xs md:text-sm text-center">أريد عرض منتجاتي أو خدماتي.</p>
              </div>
              <div onClick={() => isAppLoggedIn ? setActiveView('buyer') : navigateTo('login')} className={`${cardBg} flex-1 p-8 rounded-3xl border border-gray-700 hover:border-blue-500 cursor-pointer group flex flex-col items-center gap-4`}>
                <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-blue-500/20 flex items-center justify-center"><ShoppingBag className="text-gray-400 group-hover:text-blue-400" size={32} /></div>
                <h3 className="text-xl font-bold text-white">أنا المشتري</h3>
                <p className="text-gray-400 text-xs md:text-sm text-center">أريد البحث عن صفقات رائعة بأمان.</p>
              </div>
            </div>

            {/* --- Banner Ads Section for Monetization --- */}
            {banners.length > 0 && (
              <div className="w-full mt-16 animate-fade-in">
                 <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="h-px bg-gray-800 flex-1"></div>
                    <span className="text-gray-500 text-sm font-bold bg-[#111827] px-4">مساحات إعلانية مميزة</span>
                    <div className="h-px bg-gray-800 flex-1"></div>
                 </div>
                 <div className="flex flex-col gap-6 w-full">
                    {banners.map(banner => (
                       banner.link ? (
                         <a key={banner.id} href={banner.link} target="_blank" rel="noreferrer" className="block w-full rounded-3xl overflow-hidden border border-gray-700 shadow-2xl hover:border-emerald-500 transition-colors group">
                           <img src={banner.imageUrl} alt="Ad Banner" className="w-full h-auto object-cover max-h-48 md:max-h-64 group-hover:scale-105 transition-transform duration-500" />
                         </a>
                       ) : (
                         <div key={banner.id} className="w-full rounded-3xl overflow-hidden border border-gray-700 shadow-2xl">
                           <img src={banner.imageUrl} alt="Ad Banner" className="w-full h-auto object-cover max-h-48 md:max-h-64" />
                         </div>
                       )
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}

        {(activeView === 'buyer' || activeView === 'seller') && (
          <div className="w-full animate-fade-in text-center flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{activeView === 'buyer' ? 'ابحث عن صفقتك القادمة' : 'اعرض منتجك للبيع'}</h2>
            
            <div className="w-full max-w-3xl flex flex-col items-center relative mt-6">
              {activeView === 'seller' && userProfile?.subscriptionStatus === 'Pending' ? (
                <div className="w-full max-w-3xl bg-[#1f2937] border border-yellow-500/50 p-8 rounded-3xl text-center shadow-2xl shadow-yellow-500/10 mb-6">
                  <AlertTriangle size={40} className="mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">حساب قيد المراجعة</h3><p className="text-gray-300">الإدارة تراجع الإيصال الخاص بك. بمجرد التفعيل، يمكنك النشر والتفاعل.</p>
                </div>
              ) : activeView === 'seller' && subStatus === 'expired' ? (
                <div className="w-full max-w-3xl bg-[#1f2937] border border-red-500/50 p-8 rounded-3xl text-center shadow-2xl shadow-red-500/10 mb-6">
                  <AlertTriangle size={40} className="mx-auto text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">انتهى الاشتراك الشهري</h3><p className="text-gray-300 mb-6">انتهت باقة الـ 30 يوم الخاصة بك. يرجى تجديد الاشتراك (10 جنيه) وإرسال الإيصال للإدارة للتمكن من نشر إعلانات جديدة والتواصل.</p>
                  <button onClick={() => setShowRenewModal(true)} className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">تجديد الاشتراك الآن</button>
                </div>
              ) : (
                <>
                  {activeView === 'seller' && subStatus === 'warning' && (<div className="w-full max-w-3xl bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 p-4 rounded-xl mb-6 text-center flex items-center justify-center gap-2 font-bold shadow-lg"><AlertTriangle size={20} className="animate-pulse" />تنبيه: متبقي {subDaysLeft} أيام على انتهاء اشتراكك الشهري.</div>)}
                  {activeView === 'seller' && uploadedImages.length > 0 && (<div className="w-full flex gap-3 mb-4 overflow-x-auto pb-2"><div className="flex gap-2">{uploadedImages.map((imgObj, idx) => (<div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-emerald-500/50"><img src={imgObj.preview} alt="Preview" className="w-full h-full object-cover" /><button onClick={() => removeUploadedImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full"><X size={12} /></button></div>))}</div></div>)}
                  
                  <div className="relative w-full flex items-center">
                    <input type="text" value={activeView === 'buyer' ? searchQuery : sellerInput} onChange={(e) => activeView === 'buyer' ? setSearchQuery(e.target.value) : setSellerInput(e.target.value)} className={`w-full ${cardBg} border border-gray-700 rounded-full py-4 pl-28 ${activeView === 'seller' ? 'pr-32' : 'pr-6'} text-lg text-white outline-none focus:border-${activeView === 'buyer' ? 'blue' : 'emerald'}-500 shadow-xl`} placeholder={activeView === 'buyer' ? "عن ماذا تبحث؟" : "اكتب تفاصيل المنتج (عنوان الإعلان)..."} />
                    {activeView === 'seller' && (
                      <div className="absolute inset-y-1.5 right-1.5 flex items-center z-10">
                        <button onClick={() => setShowAdCategoryMenu(!showAdCategoryMenu)} className="h-full bg-gray-700/50 hover:bg-emerald-500/20 text-emerald-400 rounded-full px-4 flex items-center justify-center gap-1 transition-colors border border-transparent hover:border-emerald-500/50"><span className="text-xs font-bold max-w-[70px] truncate">{adCategory || 'القسم'}</span><ChevronDown size={16} /></button>
                        {showAdCategoryMenu && (
                          <div className="absolute top-full right-0 mt-2 w-48 max-h-60 bg-[#1f2937] border border-gray-700 rounded-xl shadow-2xl overflow-y-auto custom-scrollbar py-1 z-50">
                            {categories.map(cat => ( <button key={cat} onClick={() => { setAdCategory(cat); setShowAdCategoryMenu(false); }} className={`w-full text-right px-4 py-2.5 text-sm hover:bg-emerald-500/10 transition-colors ${adCategory === cat ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-white'}`}>{cat}</button> ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="absolute inset-y-1.5 left-1.5 flex gap-1.5 items-center">
                      {activeView === 'seller' && (<label className={`cursor-pointer bg-gray-700/50 p-2.5 rounded-full flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors h-full aspect-square`}><ImagePlus size={20} /><input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" /></label>)}
                      <button onClick={async () => {
                          if (activeView === 'buyer') { setFilterCategory(searchQuery.trim() !== '' ? `بحث: ${searchQuery}` : 'الكل'); navigateTo('results'); } 
                          else {
                            if (sellerInput.trim() !== '' || uploadedImages.length > 0) {
                              setIsUploading(true); 
                              try {
                                const finalImageUrls = [];
                                for (const item of uploadedImages) {
                                  if (item.file) { 
                                    try { const formData = new FormData(); formData.append('image', item.file); const res = await fetch('https://api.imgbb.com/1/upload?key=8c8cec8f9ee7b67db88ba5799154c94d', { method: 'POST', body: formData }); if (res.ok) { finalImageUrls.push((await res.json()).data.url); } } catch (err) { finalImageUrls.push(item.preview); } 
                                  }
                                }
                                const newAd = { title: sellerInput || 'إعلان جديد', titleEn: sellerInput || 'New Ad', category: adCategory, description: '', views: 0, statusAr: 'قيد المراجعة', statusEn: 'Pending', date: new Date().toISOString().split('T')[0], location: 'مصر', time: 'الآن', price: 'السعر بالاتفاق', images: finalImageUrls.length > 0 ? finalImageUrls : ["https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800"], sellerId: userProfile.uid, sellerName: userProfile.displayName, createdAt: Date.now() };
                                await setDoc(doc(db, 'ads', Date.now().toString()), newAd);
                                setSellerInput(''); setUploadedImages([]); setIsUploading(false); setAppAlert('تم رفع الإعلان بنجاح. وهو الآن قيد المراجعة من الإدارة للحماية. يمكنك تعديل الوصف من صفحة "إعلاناتي".');
                              } catch (err) { setIsUploading(false); setAppAlert('حدث خطأ.'); }
                            }
                          }
                        }} className={`h-full ${activeView === 'buyer' ? 'bg-blue-600 hover:bg-blue-700' : accentBg} text-white px-6 md:px-8 rounded-full font-bold transition-colors`}>{activeView === 'buyer' ? 'بحث' : 'إرسال'}</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
              <div onClick={() => navigateTo('live-feed')}><ActionIcon icon={<Activity className="text-red-500 animate-pulse" />} label="الرادار المباشر" highlight="red" /></div>
              <div onClick={() => setShowFilterModal(true)}><ActionIcon icon={<SlidersHorizontal />} label="فلترة ذكية" /></div>
              <div onClick={() => navigateTo('directory')}><ActionIcon icon={<UserSearch className="text-blue-400" />} label="دليل المشتركين" /></div>
              <div onClick={() => navigateTo('my-ads')}><ActionIcon icon={<Megaphone />} label="إعلاناتي" /></div>
              <div onClick={() => setShowSettingsModal(true)}><ActionIcon icon={<Settings />} label="الإعدادات" /></div>
            </div>
          </div>
        )}

        {/* --- SETTINGS MODAL --- */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-[#1f2937] rounded-3xl p-8 w-full max-w-lg relative shadow-2xl border border-gray-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
               <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 left-4 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full z-10"><X size={20}/></button>
               <h3 className="text-2xl font-bold mb-6 text-white text-center mt-4">إعدادات الحساب</h3>
               
               <div className="flex flex-col items-center mb-6">
                 <div className="relative w-24 h-24 rounded-full border-2 border-emerald-500 overflow-hidden mb-3">
                    {profileImagePreview || userProfile?.photoUrl ? <img src={profileImagePreview || userProfile?.photoUrl} alt="Profile" className="w-full h-full object-cover" /> : <AvatarFallback size={96} />}
                 </div>
                 <label className="bg-gray-800 text-emerald-400 px-4 py-2 rounded-lg cursor-pointer text-sm font-bold border border-gray-700 hover:border-emerald-500 transition-colors">تغيير الصورة<input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} /></label>
               </div>

               <div className="space-y-4">
                 <div><label className="block text-gray-400 text-sm mb-1">اسم العرض (البراند)</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" /></div>
                 <div><label className="block text-gray-400 text-sm mb-1">رقم الهاتف</label><input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500" /></div>
                 <div><label className="block text-gray-400 text-sm mb-1">نبذة عنك (Bio)</label><textarea rows="3" value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 resize-none custom-scrollbar" placeholder="اكتب نبذة مختصرة عنك وعن منتجاتك..."></textarea></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="flex items-center gap-1 text-blue-400 text-sm mb-1"><Facebook size={16}/> رابط فيسبوك</label><input type="url" value={editFacebook} onChange={e => setEditFacebook(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-blue-500" placeholder="https://facebook.com/..." /></div>
                    <div><label className="flex items-center gap-1 text-red-400 text-sm mb-1"><Youtube size={16}/> رابط يوتيوب</label><input type="url" value={editYoutube} onChange={e => setEditYoutube(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-red-500" placeholder="https://youtube.com/..." /></div>
                 </div>
                 <button onClick={saveProfileUpdates} className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 mt-4 shadow-lg shadow-emerald-500/20">حفظ جميع التغييرات</button>
               </div>
            </div>
          </div>
        )}

        {/* --- MEMBERS DIRECTORY --- */}
        {activeView === 'directory' && (
           <div className="w-full animate-fade-in flex flex-col items-center h-full">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold flex items-center gap-2"><UserSearch className="text-blue-400"/> دليل المشتركين</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">رجوع</button></div>
             
             <div className="w-full max-w-2xl mb-8 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input type="text" value={directorySearch} onChange={e => setDirectorySearch(e.target.value)} placeholder="ابحث عن متجر، تاجر أو رقم هاتف..." className="w-full bg-[#1f2937] border border-gray-700 rounded-full py-4 pr-12 pl-4 text-white outline-none focus:border-blue-500 shadow-xl" />
             </div>
             
             <div className="w-full max-h-[65vh] overflow-y-auto custom-scrollbar pr-2 pb-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {allProfiles.filter(p => !p.isBanned && (p.displayName?.includes(directorySearch) || p.fullName?.includes(directorySearch) || p.phone?.includes(directorySearch))).map(profile => (
                   <div key={profile.uid} className="bg-[#1f2937] p-5 rounded-2xl border border-gray-700 flex flex-col sm:flex-row gap-4 items-center hover:border-emerald-500 transition-colors">
                      {profile.photoUrl ? <img src={profile.photoUrl} alt="User" className="w-20 h-20 rounded-full object-cover border-2 border-gray-600 shrink-0" /> : <AvatarFallback size={80} className="border-2 border-gray-600 shrink-0" />}
                      <div className="flex-1 text-center sm:text-right">
                         <h4 className="font-bold text-white text-lg">{profile.displayName || profile.fullName}</h4>
                         <p className="text-gray-400 text-sm line-clamp-2 mt-1 min-h-[40px]">{profile.bio || 'لا توجد نبذة تعريفية.'}</p>
                         <div className="flex gap-2 justify-center sm:justify-start mt-3">
                            <button onClick={() => { setViewedProfile(profile); navigateTo('user-profile'); }} className="bg-[#111827] border border-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex-1">زيارة البروفايل</button>
                            {userProfile?.uid !== profile.uid && (
                               <button onClick={() => openChat(profile.uid, profile.displayName)} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"><MessageSquare size={16}/> شات</button>
                            )}
                         </div>
                      </div>
                   </div>
                 ))}
                 {allProfiles.length === 0 && <p className="text-gray-500 text-center py-10 w-full col-span-2">جاري التحميل أو لا يوجد مستخدمين.</p>}
               </div>
             </div>
           </div>
        )}

        {/* --- USER PROFILE VIEW --- */}
        {activeView === 'user-profile' && viewedProfile && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full mb-4"><button onClick={goBack} className="text-gray-400 hover:text-white flex items-center gap-2"><ArrowRight size={20} /> رجوع</button></div>
             
             {/* Profile Card */}
             <div className="w-full bg-[#1f2937] rounded-3xl overflow-hidden shadow-2xl border border-gray-700 mb-8 relative">
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-cyan-600 relative"></div>
                <div className="px-6 pb-6 pt-0 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-right relative -mt-16">
                   <div className="relative">
                      {viewedProfile.photoUrl ? <img src={viewedProfile.photoUrl} alt="User" className="w-32 h-32 rounded-full object-cover border-4 border-[#1f2937] bg-[#1f2937] shadow-xl" /> : <AvatarFallback size={128} className="border-4 border-[#1f2937] shadow-xl" />}
                      {viewedProfile.subscriptionStatus === 'Active' && <span className="absolute bottom-2 right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-[#1f2937]"><ShieldCheck size={16}/></span>}
                   </div>
                   <div className="flex-1 mt-2 md:mt-16">
                      <h2 className="text-3xl font-black text-white">{viewedProfile.displayName || viewedProfile.fullName}</h2>
                      {viewedProfile.bio && <p className="text-gray-300 mt-3 leading-relaxed max-w-2xl">{viewedProfile.bio}</p>}
                      <div className="flex items-center gap-3 justify-center md:justify-start mt-4">
                         {viewedProfile.facebookUrl && <a href={viewedProfile.facebookUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-lg"><Facebook size={18}/> فيسبوك</a>}
                         {viewedProfile.youtubeUrl && <a href={viewedProfile.youtubeUrl} target="_blank" rel="noreferrer" className="text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg"><Youtube size={18}/> يوتيوب</a>}
                      </div>
                   </div>
                   {userProfile?.uid !== viewedProfile.uid && (
                      <div className="mt-4 md:mt-16 w-full md:w-auto">
                         <button onClick={() => openChat(viewedProfile.uid, viewedProfile.displayName)} className="w-full md:w-auto bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"><Send size={20}/> إرسال رسالة</button>
                      </div>
                   )}
                </div>
             </div>

             <div className="w-full flex items-center gap-2 mb-6"><Megaphone className="text-emerald-400"/><h3 className="text-2xl font-bold">إعلانات هذا البائع</h3></div>
             
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
               {globalAds.filter(ad => ad.sellerId === viewedProfile.uid && ad.statusEn === 'Active').map(ad => (
                 <div key={ad.id} onClick={() => viewAdDetails(ad)} className="bg-[#1f2937] p-4 rounded-2xl border border-gray-700 cursor-pointer hover:border-emerald-500">
                    <img src={ad.images?.[0]} alt="ad" className="w-full h-40 object-cover rounded-xl mb-3" />
                    <h4 className="font-bold text-white">{lang === 'ar' ? ad.title : ad.titleEn}</h4><p className="text-gray-400 text-xs mt-1">{ad.category}</p><p className="text-emerald-400 font-bold mt-2">{ad.price} {lang === 'ar' ? 'ج.م' : 'EGP'}</p>
                 </div>
               ))}
               {globalAds.filter(ad => ad.sellerId === viewedProfile.uid && ad.statusEn === 'Active').length === 0 && <p className="text-gray-500 col-span-2 text-center py-6">لا توجد إعلانات نشطة لهذا البائع حالياً.</p>}
             </div>
           </div>
        )}

        {/* --- LIVE FEED --- */}
        {activeView === 'live-feed' && (
          <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold flex items-center gap-3"><Activity className="text-red-500 animate-pulse" /> رادار الإعلانات المباشر</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">رجوع</button></div>
             <div className="w-full flex flex-col gap-4">
                {liveFeedAds.map(ad => (
                  <div key={ad.id} onClick={() => viewAdDetails(ad)} className="bg-[#1f2937] p-4 rounded-2xl flex gap-4 cursor-pointer hover:border-red-500 border border-transparent transition-colors">
                    <img src={ad.images?.[0]} alt="ad" className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1"><h4 className="font-bold text-lg text-white">{lang === 'ar' ? ad.title : ad.titleEn}</h4><p className="text-gray-400 text-sm mb-1">{ad.category}</p><p className="text-red-400 font-bold">{ad.price} ج.م</p></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- MY ADS --- */}
        {activeView === 'my-ads' && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">إعلاناتي</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">رجوع</button></div>
             <div className="w-full flex flex-col gap-4">
               {myAds.map(ad => {
                 const adAge = Date.now() - ad.createdAt;
                 const daysLeft = Math.max(0, Math.ceil((AD_EXPIRATION_MS - adAge) / (1000 * 60 * 60 * 24)));
                 const isExpired = adAge >= AD_EXPIRATION_MS;
                 return(
                 <div key={ad.id} className="bg-[#1f2937] p-4 rounded-2xl flex flex-col sm:flex-row gap-4 border border-gray-700 items-start sm:items-center">
                   <div className="flex gap-4 w-full sm:w-auto">
                     <img src={ad.images?.[0]} alt="ad" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                     <div className="flex-1">
                       <h4 className="font-bold text-white leading-tight mb-1">{ad.title}</h4>
                       <p className="text-emerald-400 font-bold text-sm mb-1">{ad.price} ج.م</p>
                       <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-gray-400 text-xs flex items-center gap-2"><span className="bg-gray-800 px-2 py-0.5 rounded">{ad.category}</span><span><Eye size={12} className="inline mr-1 text-blue-400"/>{ad.views || 0}</span></p>
                          {!isExpired && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded"><Clock size={12}/> متبقي {daysLeft} يوم</span>}
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto gap-2 border-t border-gray-700 sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                     {isExpired ? ( <span className="text-red-500 text-xs font-bold bg-red-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1"><AlertTriangle size={14}/> منتهي</span>
                     ) : ad.statusEn === 'Pending' ? ( <span className="text-yellow-500 text-xs font-bold bg-yellow-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1"><AlertTriangle size={14}/> للمراجعة</span>
                     ) : ( <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle size={14}/> نشط</span> )}
                     <div className="flex gap-2">
                       <button onClick={() => { setAdToEdit({ ...ad, description: ad.description || '' }); setEditNewImages([]); }} className="bg-blue-500/10 text-blue-400 p-2 rounded-lg hover:bg-blue-500/20 transition-colors"><Edit size={18}/></button>
                       <button onClick={() => { setConfirmModal({ isOpen: true, title: 'حذف إعلانك', message: 'هل أنت متأكد من حذف إعلانك نهائياً؟', confirmText: 'احذف الإعلان', type: 'danger', onConfirm: async () => { setIsUploading(true); try { await deleteDoc(doc(db, 'ads', ad.id)); setAppAlert('تم حذف الإعلان بنجاح'); } catch(e) { } setIsUploading(false); setConfirmModal({ ...confirmModal, isOpen: false }); } }); }} className="bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 transition-colors"><Trash2 size={18}/></button>
                     </div>
                   </div>
                 </div>
               )})}
               {myAds.length === 0 && <p className="text-gray-500 text-center py-10 w-full">لا توجد إعلانات لك حتى الآن.</p>}
             </div>
           </div>
        )}

        {/* --- RESULTS --- */}
        {activeView === 'results' && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">النتائج: {filterCategory}</h2><button onClick={goBack} className="bg-[#1f2937] px-4 py-2 rounded-full border border-gray-700">رجوع</button></div>
             <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
               {globalAds.filter(ad => ad.statusEn === 'Active' && (Date.now() - ad.createdAt) < AD_EXPIRATION_MS && (filterCategory === 'الكل' || filterCategory.includes('بحث:') || ad.title.includes(filterCategory.replace('بحث: ', '')) || ad.category === filterCategory)).map(ad => (
                 <div key={ad.id} onClick={() => viewAdDetails(ad)} className="bg-[#1f2937] p-4 rounded-2xl border border-gray-700 cursor-pointer hover:border-emerald-500">
                    <img src={ad.images?.[0]} alt="ad" className="w-full h-40 object-cover rounded-xl mb-3" />
                    <h4 className="font-bold text-white">{ad.title}</h4><p className="text-gray-400 text-xs mt-1">{ad.category}</p><p className="text-emerald-400 font-bold mt-2">{ad.price} ج.م</p>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* --- AD DETAILS --- */}
        {activeView === 'ad-details' && selectedAd && (
           <div className="w-full animate-fade-in flex flex-col items-center">
             <div className="w-full mb-4"><button onClick={goBack} className="text-gray-400 hover:text-white flex items-center gap-2"><ArrowRight size={20} /> رجوع</button></div>
             <div className="w-full bg-[#1f2937] p-6 rounded-3xl flex flex-col md:flex-row gap-8 shadow-2xl border border-gray-700">
                <div className="w-full md:w-1/2 flex flex-col gap-3">
                   <img src={selectedAd.images?.[detailsImageIdx] || selectedAd.images?.[0]} alt="ad main" className="w-full h-64 md:h-80 object-cover rounded-2xl border border-gray-700 transition-all duration-300" />
                   {selectedAd.images?.length > 1 && (
                     <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                       {selectedAd.images.map((imgUrl, idx) => ( <img key={idx} src={imgUrl} onClick={() => setDetailsImageIdx(idx)} alt={`thumb ${idx}`} className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition-colors shrink-0 ${detailsImageIdx === idx ? 'border-emerald-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`} /> ))}
                     </div>
                   )}
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                   <h2 className="text-3xl font-bold mb-2 text-white">{selectedAd.title}</h2>
                   <div className="flex items-center gap-2 mb-4"><span className="bg-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-full font-bold">{selectedAd.category}</span><span className="text-gray-500 text-xs flex items-center gap-1"><Eye size={14}/> {selectedAd.views || 0} مشاهدة</span></div>
                   <div className="text-emerald-400 font-bold text-3xl mb-6">{selectedAd.price} ج.م</div>
                   
                   <div className="mb-6 flex items-center gap-3 bg-[#111827] p-3 rounded-xl border border-gray-700 cursor-pointer hover:border-emerald-500 transition-colors" onClick={() => { const sellerProf = allProfiles.find(p => p.uid === selectedAd.sellerId); if(sellerProf) { setViewedProfile(sellerProf); navigateTo('user-profile'); } }}>
                      {allProfiles.find(p => p.uid === selectedAd.sellerId)?.photoUrl ? <img src={allProfiles.find(p => p.uid === selectedAd.sellerId).photoUrl} className="w-12 h-12 rounded-full object-cover border border-gray-600"/> : <AvatarFallback size={48} />}
                      <div><p className="text-sm text-gray-400">البائع:</p><p className="text-white font-bold">{selectedAd.sellerName}</p></div>
                      <UserSearch className="mr-auto text-emerald-400 opacity-50" size={20}/>
                   </div>

                   {selectedAd.description && ( <div className="bg-[#111827] p-4 rounded-2xl border border-gray-700 mb-6 flex-1"><h4 className="text-sm font-bold text-gray-400 mb-2">الوصف والمواصفات</h4><p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedAd.description}</p></div> )}
                   <button onClick={() => openChat(selectedAd)} className="w-full bg-emerald-500 text-white font-bold rounded-xl py-4 flex justify-center items-center gap-2 hover:bg-emerald-600 transition-colors mt-auto shadow-lg shadow-emerald-500/20"><Send size={20} /> تواصل مع البائع</button>
                </div>
             </div>
           </div>
        )}

        {/* --- LOGIN --- */}
        {activeView === 'login' && (
          <div className="w-full max-w-md animate-fade-in"><button onClick={goBack} className="mb-4 text-gray-400">رجوع</button><div className={`${cardBg} p-8 rounded-2xl`}><h2 className="text-3xl font-bold mb-6 text-center">دخول</h2>
            <input type="text" placeholder="البريد الإلكتروني أو الهاتف" autoComplete="off" value={loginData.identifier} onChange={e => setLoginData({...loginData, identifier: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 mb-4 text-white outline-none focus:border-emerald-500" />
            <div className="relative mb-2">
              <input type={showPassword ? "text" : "password"} placeholder="كلمة المرور" autoComplete="new-password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3 text-gray-400 hover:text-white">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
            <div className="flex justify-end mb-6"><button onClick={() => setActiveView('forgot-password')} className="text-emerald-400 text-sm hover:underline">نسيت كلمة المرور؟</button></div>
            {loginError && <p className="text-red-500 text-sm mb-4">{loginError}</p>}
            <button onClick={handleLoginSubmit} className="w-full bg-emerald-500 text-white font-bold rounded-lg py-3 hover:bg-emerald-600">تسجيل الدخول</button>
          </div></div>
        )}

        {/* --- FORGOT PASSWORD --- */}
        {activeView === 'forgot-password' && (
          <div className="w-full max-w-md animate-fade-in"><button onClick={() => setActiveView('login')} className="mb-4 text-gray-400">العودة لتسجيل الدخول</button><div className={`${cardBg} p-8 rounded-2xl`}><h2 className="text-2xl font-bold mb-2 text-center text-white">استعادة كلمة المرور</h2><p className="text-gray-400 text-sm text-center mb-6">أدخل بياناتك لتعيين كلمة مرور جديدة</p>
            <input type="email" placeholder="البريد الإلكتروني" autoComplete="off" value={resetData.email} onChange={e => setResetData({...resetData, email: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 mb-4 text-white outline-none focus:border-emerald-500" />
            <input type="tel" placeholder="رقم الهاتف المسجل للحساب" autoComplete="off" value={resetData.phone} onChange={e => setResetData({...resetData, phone: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 mb-4 text-white outline-none focus:border-emerald-500" />
            <input type="text" placeholder="اكتب كلمة المرور الجديدة" autoComplete="new-password" value={resetData.newPassword} onChange={e => setResetData({...resetData, newPassword: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 mb-6 text-white outline-none focus:border-emerald-500" />
            {resetError && <p className="text-red-500 text-sm mb-4 text-center">{resetError}</p>}
            {resetSuccess && <p className="text-emerald-400 text-sm mb-4 text-center font-bold">{resetSuccess}</p>}
            <button onClick={handlePasswordReset} className="w-full bg-emerald-500 text-white font-bold rounded-lg py-3 hover:bg-emerald-600">تغيير كلمة المرور</button>
          </div></div>
        )}

        {/* --- SIGNUP VIEW --- */}
        {activeView === 'signup' && (
          <div className="w-full max-w-2xl animate-fade-in"><button onClick={goBack} className="mb-4 text-gray-400">رجوع</button>
            <div className={`${cardBg} p-8 rounded-2xl`}>
               <h2 className="text-3xl font-bold mb-6 text-center">حساب جديد</h2>
               
               <div className="flex flex-col items-center mb-8">
                 <div className="relative w-24 h-24 rounded-full border-2 border-emerald-500 overflow-hidden mb-3 shadow-lg shadow-emerald-500/20">
                    {signupProfilePreview ? <img src={signupProfilePreview} alt="Profile" className="w-full h-full object-cover" /> : <AvatarFallback size={96} />}
                 </div>
                 <label className="bg-[#111827] text-emerald-400 px-4 py-2 rounded-lg cursor-pointer text-sm font-bold border border-gray-700 hover:border-emerald-500 transition-colors shadow-md">
                    <span className="flex items-center gap-2"><ImagePlus size={16} /> أضف صورة للبروفايل (اختياري)</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files && e.target.files[0]) { setSignupProfilePreview(URL.createObjectURL(e.target.files[0])); setSignupProfileImage(e.target.files[0]); } }} />
                 </label>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="الاسم الكامل" autoComplete="off" value={signupData.fullName} onChange={e => setSignupData({...signupData, fullName: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                  <input type="text" placeholder="اسم العرض (البراند الخاص بك)" autoComplete="off" value={signupData.displayName} onChange={e => setSignupData({...signupData, displayName: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                  <input type="email" placeholder="البريد الإلكتروني" autoComplete="off" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white col-span-1 md:col-span-2 outline-none focus:border-emerald-500" />
                  <input type="tel" placeholder="رقم الهاتف" autoComplete="off" value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white col-span-1 md:col-span-2 outline-none focus:border-emerald-500" />
                  
                  <div className="relative">
                    <input type={showSignupPass ? "text" : "password"} placeholder="كلمة المرور" autoComplete="new-password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                    <button type="button" onClick={() => setShowSignupPass(!showSignupPass)} className="absolute left-3 top-3 text-gray-400 hover:text-white">{showSignupPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>
                  <div className="relative">
                    <input type={showSignupConfirm ? "text" : "password"} placeholder="تأكيد كلمة المرور" autoComplete="new-password" value={signupData.confirmPassword} onChange={e => setSignupData({...signupData, confirmPassword: e.target.value})} className="w-full bg-[#111827] border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500" />
                    <button type="button" onClick={() => setShowSignupConfirm(!showSignupConfirm)} className="absolute left-3 top-3 text-gray-400 hover:text-white">{showSignupConfirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>

                  <label className="col-span-1 md:col-span-2 border border-dashed border-emerald-500/50 p-6 rounded-xl text-center cursor-pointer text-gray-400 hover:border-emerald-500 transition-colors bg-emerald-500/5 mt-2">
                     <Upload className="mx-auto mb-2 text-emerald-400" /> {receiptUploaded ? 'تم إرفاق الإيصال بنجاح' : 'إرفاق صورة إيصال الدفع (10 جنيه) (إلزامي)'}<input type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files[0]) { setReceiptUploaded(true); setReceiptFile(e.target.files[0]); } }} />
                  </label>
                  
                  {signupError && <p className="col-span-1 md:col-span-2 text-red-500 text-sm text-center font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{signupError}</p>}
                  <button onClick={handleSignupSubmit} className="col-span-1 md:col-span-2 bg-emerald-500 text-white font-bold rounded-lg py-4 mt-2 hover:bg-emerald-600 shadow-lg transition-colors">تأكيد التسجيل</button>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* --- CHATS DOCK --- */}
      <div className="fixed z-[50] left-4 bottom-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
         {dockedChats.map(chat => (
            <div key={chat.id} className="h-14 pr-2 pl-4 rounded-2xl bg-[#1f2937] border border-gray-700 text-white flex items-center shadow-2xl relative gap-3 group">
               <button onClick={() => setActiveChatId(chat.id)} className="flex items-center gap-3 flex-1 text-right hover:text-emerald-400 transition-colors"><MessageSquare size={20} className="text-emerald-400 shrink-0" /><span className="font-bold text-sm max-w-[140px] truncate" dir="rtl">{chat.adTitle}</span></button>
               <div className="w-px h-6 bg-gray-700 mx-1"></div>
               <button onClick={() => { setOpenChatIds(prev => prev.filter(id => id !== chat.id)); if (activeChatId === chat.id) setActiveChatId(null); }} className="text-gray-500 hover:text-red-400 p-2" title="إغلاق المحادثة"><X size={16}/></button>
               {unreadCounts[chat.id] > 0 && <span className="absolute -top-2 -left-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border-2 border-[#1f2937]">{unreadCounts[chat.id]}</span>}
            </div>
         ))}
      </div>

      {/* --- ACTIVE CHAT --- */}
      {activeChat && (() => {
         const pos = chatPositions[activeChatId] || { x: 20, y: 20 };
         const otherUserId = activeChat.participants.find(id => id !== userProfile?.uid);
         const otherUserProfile = allProfiles.find(p => p.uid === otherUserId);

         return (
            <div style={{ left: pos.x, top: pos.y }} className={`fixed z-[60] w-[350px] h-[480px] flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-[#111827] border border-gray-600`}>
              <div onMouseDown={(e) => handleMouseDown(e, activeChatId)} className="bg-[#1f2937] p-3 flex justify-between items-center cursor-move border-b border-gray-800">
                
                {/* Chat Header -> Clickable to go to profile */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-1.5 rounded-lg flex-1 overflow-hidden transition-colors" onClick={() => { if(otherUserProfile) { setViewedProfile(otherUserProfile); navigateTo('user-profile'); } }}>
                   {otherUserProfile?.photoUrl ? <img src={otherUserProfile.photoUrl} className="w-8 h-8 rounded-full object-cover shrink-0" /> : <AvatarFallback size={32} />}
                   <span className="text-white font-bold text-sm truncate" dir="rtl">{otherUserProfile?.displayName || activeChat.adTitle}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0"><button onClick={() => setActiveChatId(null)} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition-colors" title="تصغير"><Minus size={18}/></button><button onClick={() => { setOpenChatIds(prev => prev.filter(id => id !== activeChatId)); setActiveChatId(null); }} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/20 transition-colors" title="إغلاق المحادثة"><X size={18}/></button></div>
              </div>
              <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-3 py-2 text-center"><p className="text-yellow-500 text-[10px] font-bold leading-relaxed">⚠️ تنبيه: الموقع غير مسؤول عن أي تحويلات مالية خارج المنصة. يُمنع استخدام ألفاظ خارجة.</p></div>
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                 {(activeChat.messages || []).map((msg, idx) => {
                   const isSender = msg.senderId === userProfile?.uid;
                   return (<div key={idx} className={`flex w-full ${isSender ? 'justify-end' : 'justify-start'}`}><div className={`p-2 rounded-xl text-sm ${isSender ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-100'}`}>{msg.text}</div></div>);
                 })}
                 <div ref={chatMessagesEndRef} />
              </div>
              <div className="p-2 flex gap-2 bg-[#1f2937]">
                 <input type="text" value={chatInputs[activeChatId] || ''} onChange={(e) => setChatInputs(prev => ({...prev, [activeChatId]: e.target.value}))} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-[#111827] rounded-full px-3 text-white text-sm outline-none" placeholder="رسالة..." />
                 <button onClick={handleSendMessage} className="bg-emerald-500 text-white p-2 rounded-full"><Send size={16}/></button>
              </div>
            </div>
         );
      })()}

        {/* --- ADMIN DASHBOARD --- */}
        {activeView === 'admin-dashboard' && (
          <div className="w-full max-w-4xl mx-auto animate-fade-in">
            <button onClick={() => navigateTo('landing')} className="mb-6 text-emerald-400 hover:text-white font-bold text-lg">← العودة للرئيسية</button>
            <div className={`${cardBg} p-8 rounded-2xl`}>
              
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6">
                <h2 className="text-3xl font-bold text-emerald-400 mb-4 sm:mb-0">لوحة تحكم الإدارة</h2>
                <button onClick={() => { setPendingUsers(allProfiles.filter(u => u.subscriptionStatus === 'Pending')); setAppAlert('تم جلب وتحديث الطلبات بنجاح!'); }} className="bg-emerald-600 px-6 py-2 rounded-lg text-white font-bold hover:bg-emerald-500 transition-colors">تحديث القائمة (جلب الطلبات)</button>
              </div>
              
              {/* قسم طلبات التفعيل */}
              <div className="mb-4 relative">
                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input type="text" value={adminPendingSearch} onChange={e => setAdminPendingSearch(e.target.value)} placeholder="ابحث في الطلبات بالاسم، الرقم، الإيميل..." className="w-full bg-[#111827] border border-gray-700 rounded-lg py-3 pr-10 pl-4 text-sm text-white outline-none focus:border-emerald-500" />
              </div>
              {pendingUsers.length === 0 ? (
                <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 text-center"><p className="text-gray-400">لا توجد طلبات في قائمة الانتظار حالياً.</p><p className="text-sm text-gray-500 mt-2">اضغط على "تحديث القائمة" لجلب التحديثات الجديدة.</p></div>
              ) : (
                <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                  {pendingUsers.filter(u => u.fullName?.includes(adminPendingSearch) || u.phone?.includes(adminPendingSearch) || u.email?.includes(adminPendingSearch)).map(u => (
                    <div key={u.uid} className="bg-[#111827] p-5 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex gap-4 items-center">
                         {u.photoUrl ? <img src={u.photoUrl} alt="User" className="w-14 h-14 rounded-full object-cover border border-gray-600" /> : <AvatarFallback size={56} />}
                         <div><p className="text-xl text-white font-bold">{u.fullName}</p><p className="text-sm text-gray-400 mt-1">الإيميل: {u.email} | الهاتف: {u.phone}</p><a href={u.receiptUrl} target="_blank" rel="noreferrer" className="text-emerald-400 text-sm hover:underline mt-2 inline-block font-bold">👀 عرض إيصال الدفع (نافذة جديدة)</a></div>
                      </div>
                      <button onClick={async () => { setIsUploading(true); try { const activationTime = Date.now(); await updateDoc(doc(db, 'users', u.uid), { subscriptionStatus: 'Active', activatedAt: activationTime }); await updateDoc(doc(db, 'profiles', u.uid), { subscriptionStatus: 'Active', activatedAt: activationTime }); setPendingUsers(pendingUsers.filter(user => user.uid !== u.uid)); setAppAlert('تم تفعيل الحساب وتجديد الـ 30 يوم بنجاح!'); } catch(err) { setAppAlert('خطأ: تم رفض الإذن من قاعدة البيانات.'); } setIsUploading(false); }} className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 font-bold w-full sm:w-auto shrink-0">تفعيل الحساب (30 يوم)</button>
                    </div>
                  ))}
                  {pendingUsers.filter(u => u.fullName?.includes(adminPendingSearch) || u.phone?.includes(adminPendingSearch) || u.email?.includes(adminPendingSearch)).length === 0 && <p className="text-gray-500 text-center py-4">لا توجد نتائج مطابقة لبحثك.</p>}
                </div>
              )}

              {/* قسم إدارة البنرات الإعلانية */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12">
                <h2 className="text-2xl font-bold text-pink-400 mb-4 sm:mb-0 flex items-center gap-2">
                  <ImagePlus/> إدارة المساحات الإعلانية (البنرات)
                </h2>
              </div>
              <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-700 shadow-xl">
                 <div className="flex flex-col gap-4 mb-6">
                    <label className="border border-dashed border-gray-600 p-4 rounded-xl text-center cursor-pointer block text-gray-400 hover:border-emerald-500 transition-colors">
                       <Upload className="mx-auto mb-2" />
                       {newBannerImage ? 'تم اختيار الصورة الإعلانية بنجاح' : 'إرفاق صورة البنر الإعلاني (يفضل صورة أفقية)'}
                       <input type="file" className="hidden" accept="image/*" onChange={(e) => { if(e.target.files[0]) setNewBannerImage(e.target.files[0]); }} />
                    </label>
                    <input type="url" placeholder="رابط الإعلان (اختياري) - مثلاً: صفحة الفيسبوك للمعلن" value={newBannerLink} onChange={e => setNewBannerLink(e.target.value)} className="w-full bg-[#111827] border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-pink-500" />
                    <button onClick={handleAddBanner} className="bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-500 transition-colors shadow-lg">رفع وإضافة البنر للصفحة الرئيسية</button>
                 </div>
                 
                 <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                   {banners.map(b => (
                      <div key={b.id} className="bg-[#111827] p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
                         <img src={b.imageUrl} className="w-32 h-16 object-cover rounded-lg border border-gray-600 shrink-0" alt="Banner Preview" />
                         <div className="flex-1 text-center sm:text-right overflow-hidden">
                            {b.link ? <a href={b.link} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline truncate block">{b.link}</a> : <span className="text-gray-500 text-sm">إعلان بدون رابط</span>}
                         </div>
                         <button onClick={() => handleDeleteBanner(b.id)} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-colors shrink-0">إزالة</button>
                      </div>
                   ))}
                   {banners.length === 0 && <p className="text-gray-500 text-center py-4">لا توجد مساحات إعلانية مفعلة حالياً.</p>}
                 </div>
              </div>

              {/* قسم إدارة جميع المشتركين (الحظر) */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12"><h2 className="text-2xl font-bold text-orange-400 mb-4 sm:mb-0 flex items-center gap-2"><Ban/> إدارة المشتركين والحظر</h2></div>
              <div className="mb-4 relative">
                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                 <input type="text" value={adminMembersSearch} onChange={e => setAdminMembersSearch(e.target.value)} placeholder="ابحث عن مشترك بالاسم، الرقم..." className="w-full bg-[#111827] border border-gray-700 rounded-lg py-3 pr-10 pl-4 text-sm text-white outline-none focus:border-orange-500" />
              </div>
              <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-700 shadow-xl max-h-96 overflow-y-auto custom-scrollbar">
                 <div className="space-y-3">
                   {allProfiles.filter(p => p.displayName?.includes(adminMembersSearch) || p.fullName?.includes(adminMembersSearch) || p.phone?.includes(adminMembersSearch)).map(p => (
                      <div key={p.uid} className="bg-[#111827] p-4 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                         <div className="flex items-center gap-3">
                           {p.photoUrl ? <img src={p.photoUrl} className="w-10 h-10 rounded-full object-cover shrink-0"/> : <AvatarFallback size={40}/>}
                           <div>
                              <p className="text-white font-bold">{p.displayName || p.fullName} {p.isBanned && <span className="text-red-500 text-xs bg-red-500/10 px-2 py-0.5 rounded ml-2">محظور</span>}</p>
                              <p className="text-gray-400 text-xs">{p.phone} | {p.email}</p>
                           </div>
                         </div>
                         <button onClick={async () => {
                            setIsUploading(true);
                            try {
                               await updateDoc(doc(db, 'users', p.uid), { isBanned: !p.isBanned });
                               await updateDoc(doc(db, 'profiles', p.uid), { isBanned: !p.isBanned });
                               setAppAlert(p.isBanned ? 'تم فك الحظر بنجاح.' : 'تم حظر المستخدم بنجاح.');
                            } catch(e) { setAppAlert('حدث خطأ.'); }
                            setIsUploading(false);
                         }} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors shrink-0 ${p.isBanned ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                            {p.isBanned ? 'فك الحظر' : 'حظر نهائي'}
                         </button>
                      </div>
                   ))}
                   {allProfiles.filter(p => p.displayName?.includes(adminMembersSearch) || p.fullName?.includes(adminMembersSearch) || p.phone?.includes(adminMembersSearch)).length === 0 && <p className="text-gray-500 text-center py-4">لا توجد نتائج مطابقة لبحثك.</p>}
                 </div>
              </div>

              {/* قسم الشكاوى */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12"><h2 className="text-2xl font-bold text-blue-400 mb-4 sm:mb-0 flex items-center gap-2"><MessageCircleWarning/> صندوق الشكاوى</h2></div>
              <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-700 shadow-xl max-h-96 overflow-y-auto custom-scrollbar">
                 {adminComplaints.length === 0 ? ( <p className="text-gray-500 text-center py-4">لا توجد شكاوى حالياً.</p> ) : (
                   <div className="space-y-4">
                     {adminComplaints.map(comp => (
                        <div key={comp.id} className="bg-[#111827] p-4 rounded-xl border border-gray-700">
                           <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                              <div><p className="text-emerald-400 font-bold text-sm">مُرسل من: {comp.senderName}</p><p className="text-gray-400 text-xs">رقم الهاتف: {comp.phone}</p></div>
                              <span className="text-gray-500 text-xs">{new Date(comp.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{comp.text}</p>
                        </div>
                     ))}
                   </div>
                 )}
              </div>

              {/* إدارة الأقسام */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12"><h2 className="text-2xl font-bold text-yellow-400 mb-4 sm:mb-0">إدارة الأقسام (Categories)</h2><button onClick={async () => { setIsUploading(true); try { await setDoc(doc(db, 'settings', 'categories'), { list: defaultCategoriesList }, { merge: true }); setCategories(defaultCategoriesList); setAppAlert('تم إعادة تعيين الأقسام للقائمة الافتراضية بنجاح!'); } catch(e) {} setIsUploading(false); }} className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2">إعادة التعيين للافتراضي</button></div>
              <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-700 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-3 mb-6"><input type="text" value={newCategoryInput} onChange={e => setNewCategoryInput(e.target.value)} placeholder="اكتب اسم القسم الجديد هنا..." className="flex-1 bg-[#111827] border border-gray-700 rounded-xl p-4 text-white outline-none focus:border-yellow-500" /><button onClick={handleAddCategory} className="bg-yellow-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"><Plus size={20}/> إضافة القسم</button></div>
                <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {categories.map(cat => ( <div key={cat} className="bg-[#111827] border border-gray-700 px-4 py-2.5 rounded-full flex items-center gap-3 text-white font-bold">{cat}<button onClick={() => handleDeleteCategory(cat)} className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-colors"><Trash2 size={16}/></button></div> ))}
                  {categories.length === 0 && <p className="text-gray-500 text-sm w-full text-center py-4">لا توجد أقسام حالياً.</p>}
                </div>
              </div>

              {/* مراجعة الإعلانات */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12"><h2 className="text-2xl font-bold text-blue-400 mb-4 sm:mb-0">مراجعة الإعلانات الجديدة</h2></div>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                 {globalAds.filter(ad => ad.statusEn === 'Pending').length === 0 ? (
                    <div className="bg-[#111827] p-6 rounded-xl border border-gray-700 text-center"><p className="text-gray-400">لا توجد إعلانات في انتظار المراجعة.</p></div>
                 ) : (
                    globalAds.filter(ad => ad.statusEn === 'Pending').map(ad => (
                      <div key={ad.id} className="bg-[#111827] p-5 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                         <div className="flex gap-4 items-center">
                            <img src={ad.images?.[0]} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="ad" />
                            <div><p className="text-lg text-white font-bold">{ad.title}</p><p className="text-sm text-gray-400 mt-1">القسم: {ad.category} | السعر: {ad.price} | البائع: {ad.sellerName || ad.sellerId}</p></div>
                         </div>
                         <div className="flex gap-2 w-full sm:w-auto shrink-0">
                            <button onClick={() => { setConfirmModal({ isOpen: true, title: 'رفض الإعلان', message: 'هل أنت متأكد من رفض وحذف هذا الإعلان نهائياً؟', confirmText: 'رفض وحذف', type: 'danger', onConfirm: async () => { setConfirmModal({ ...confirmModal, isOpen: false }); setIsUploading(true); try { await deleteDoc(doc(db, 'ads', ad.id)); setAppAlert('تم حذف الإعلان لعدم الموافقة.'); } catch(e) {} setIsUploading(false); } }); }} className="bg-red-500/20 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-500 hover:text-white flex-1 sm:flex-none">رفض</button>
                            <button onClick={async () => { setIsUploading(true); try { await updateDoc(doc(db, 'ads', ad.id), { statusEn: 'Active', statusAr: 'نشط' }); setAppAlert('تم الموافقة على الإعلان ونشره بنجاح!'); } catch(e) {} setIsUploading(false); }} className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 flex-1 sm:flex-none">موافقة ونشر</button>
                         </div>
                      </div>
                    ))
                 )}
              </div>

              {/* تنظيف الإعلانات المنتهية */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12">
                <h2 className="text-2xl font-bold text-red-400 mb-4 sm:mb-0">إدارة المساحة (تنظيف الإعلانات المنتهية)</h2>
              </div>
              <div className="bg-[#1f2937] p-6 md:p-8 rounded-2xl border border-gray-700 shadow-xl text-center">
                <h3 className="text-xl text-white font-bold mb-2">الإعلانات الأقدم من 30 يوم</h3>
                <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
                  هذه الإعلانات لم تعد تظهر للمستخدمين لأن مدة صلاحيتها قد انتهت.<br/> يُفضل حذفها نهائياً لتوفير المساحة.
                </p>
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500/20 flex items-center justify-center mb-2"><span className="text-4xl font-black text-red-500">{expiredAdminAds.length}</span></div>
                  <p className="text-gray-400 text-sm font-bold mb-4">إعلان منتهي الصلاحية</p>
                  <button onClick={async () => { if(expiredAdminAds.length === 0) { setAppAlert('المساحة نظيفة! لا توجد إعلانات منتهية حالياً.'); return; } setConfirmModal({ isOpen: true, title: 'تحذير: مسح نهائي', message: `هل أنت متأكد من مسح ${expiredAdminAds.length} إعلان نهائياً؟`, confirmText: 'نعم، مسح', type: 'danger', onConfirm: async () => { setConfirmModal({...confirmModal, isOpen: false}); setIsUploading(true); try { for(const ad of expiredAdminAds) { await deleteDoc(doc(db, 'ads', ad.id)); } setAppAlert('تم تنظيف قاعدة البيانات بنجاح!'); } catch(e) {} setIsUploading(false); } }); }} className={`bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 w-full sm:w-auto ${expiredAdminAds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`} disabled={expiredAdminAds.length === 0}>
                    <Trash2 size={20} /> حذف وتفريغ المساحة الآن
                  </button>
                </div>
              </div>

              {/* الصفحات القانونية */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-700 pb-4 mb-6 mt-12"><h2 className="text-2xl font-bold text-purple-400 mb-4 sm:mb-0">إدارة الصفحات القانونية</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button onClick={() => setLegalEditModal({isOpen: true, type: 'terms', content: legalTexts.terms, title: 'شروط الاستخدام'})} className="bg-[#111827] border border-gray-700 hover:border-purple-500 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors"><FileText size={32} className="text-purple-400" /><span className="font-bold text-white text-lg">شروط الاستخدام</span></button>
                 <button onClick={() => setLegalEditModal({isOpen: true, type: 'privacy', content: legalTexts.privacy, title: 'سياسة الخصوصية'})} className="bg-[#111827] border border-gray-700 hover:border-purple-500 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors"><ShieldCheck size={32} className="text-purple-400" /><span className="font-bold text-white text-lg">سياسة الخصوصية</span></button>
                 <button onClick={() => setLegalEditModal({isOpen: true, type: 'ip', content: legalTexts.ip, title: 'حقوق الملكية الفكرية'})} className="bg-[#111827] border border-gray-700 hover:border-purple-500 p-6 rounded-xl flex flex-col items-center gap-3 transition-colors"><Sparkles size={32} className="text-purple-400" /><span className="font-bold text-white text-lg">حقوق الملكية</span></button>
              </div>
            </div>
          </div>
        )}

        {/* --- LEGAL EDIT MODAL --- */}
        {legalEditModal.isOpen && (
          <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-4">
            <div className="bg-[#1f2937] rounded-3xl p-6 w-full max-w-4xl h-[85vh] flex flex-col relative shadow-2xl">
               <button onClick={() => setLegalEditModal({...legalEditModal, isOpen: false})} className="absolute top-4 left-4 text-gray-400 hover:text-white"><X size={28}/></button>
               <h3 className="text-2xl font-bold mb-2 text-emerald-400 text-center">تعديل: {legalEditModal.title}</h3>
               <textarea className="flex-1 w-full bg-[#111827] border border-gray-700 rounded-xl p-6 text-white text-lg outline-none focus:border-emerald-500 resize-none mb-4 leading-loose" value={legalEditModal.content} onChange={(e) => setLegalEditModal({...legalEditModal, content: e.target.value})} dir="rtl" />
               <div className="flex gap-4"><button onClick={() => setLegalEditModal({...legalEditModal, isOpen: false})} className="flex-1 bg-gray-700 text-white font-bold py-4 rounded-xl hover:bg-gray-600 text-lg">إلغاء</button><button onClick={saveLegalDocument} className="flex-[2] bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 text-lg">حفظ التعديلات ونشرها</button></div>
            </div>
          </div>
        )}
        
        {/* --- LEGAL PAGES --- */}
        {activeView === 'terms' && ( <div className="w-full max-w-4xl mx-auto animate-fade-in text-right px-4"><button onClick={goBack} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"><ArrowRight size={20} /> رجوع</button><div className={`${cardBg} p-8 md:p-12 rounded-3xl shadow-xl border border-gray-700`}><div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6"><FileText size={40} className="text-emerald-400" /><h2 className="text-3xl font-bold text-white">شروط الاستخدام</h2></div><div className="text-gray-300 leading-relaxed text-lg">{renderLegalText(legalTexts.terms)}</div></div></div> )}
        {activeView === 'privacy' && ( <div className="w-full max-w-4xl mx-auto animate-fade-in text-right px-4"><button onClick={goBack} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"><ArrowRight size={20} /> رجوع</button><div className={`${cardBg} p-8 md:p-12 rounded-3xl shadow-xl border border-gray-700`}><div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6"><ShieldCheck size={40} className="text-emerald-400" /><h2 className="text-3xl font-bold text-white">سياسة الخصوصية</h2></div><div className="text-gray-300 leading-relaxed text-lg">{renderLegalText(legalTexts.privacy)}</div></div></div> )}
        {activeView === 'ip' && ( <div className="w-full max-w-4xl mx-auto animate-fade-in text-right px-4"><button onClick={goBack} className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"><ArrowRight size={20} /> رجوع</button><div className={`${cardBg} p-8 md:p-12 rounded-3xl shadow-xl border border-gray-700`}><div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-6"><Sparkles size={40} className="text-emerald-400" /><h2 className="text-3xl font-bold text-white">حقوق الملكية الفكرية</h2></div><div className="text-gray-300 leading-relaxed text-lg">{renderLegalText(legalTexts.ip)}</div></div></div> )}

      <button onClick={() => { if(isAppLoggedIn) setShowComplaintModal(true); else { setAppAlert('يرجى تسجيل الدخول أولاً للتمكن من مراسلة الإدارة.'); navigateTo('login'); } }} className="fixed bottom-6 right-6 z-[100] bg-emerald-500 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-600 transition-transform hover:scale-110 flex items-center justify-center group">
         <MessageCircleWarning size={24}/>
         <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-bold">تواصل مع الإدارة (شكاوى)</span>
      </button>

      <footer className="w-full mt-auto border-t border-gray-800 bg-[#111827] pt-8 pb-4 relative z-40">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-gray-400 font-semibold text-sm">
            <button onClick={() => navigateTo('terms')} className="hover:text-emerald-400 transition-colors">شروط الاستخدام</button>
            <button onClick={() => navigateTo('privacy')} className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</button>
            <button onClick={() => navigateTo('ip')} className="hover:text-emerald-400 transition-colors">حقوق الملكية الفكرية</button>
          </div>
          <div className="w-16 h-px bg-gray-700"></div>
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} فلتر إيجيبت. جميع الحقوق محفوظة.</p>
          <button onClick={() => navigateTo('admin-dashboard')} className="text-gray-700 hover:text-emerald-500 text-xs transition-colors">لوحة الإدارة (Admin)</button>
        </div>
      </footer>
    </div>
  );
}

function ActionIcon({ icon, label, highlight }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer w-20">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1 ${highlight === 'red' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : highlight ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#1f2937] text-gray-300 border border-gray-700 group-hover:border-emerald-500'}`}>{React.cloneElement(icon, { size: 26 })}</div>
      <span className="text-[11px] text-gray-400 text-center font-bold">{label}</span>
    </div>
  );
}
