//======================================================================
// SEVERE NO_EMOJI VIOLATIONS - JSX/React  
// การใช้อิโมจิใน JSX Components, Props, State และ UI Elements
//======================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// VIOLATION 1: Component Props และ State ที่มี Emoji
const EmojiStatusCard = ({ 
  title, 
  status = "", 
  icon = "", 
  message = "Everything looks good! ",
  onStatusChange = () => {},
  reactions = ["", "", "", ""]
}) => {
  const [currentReaction, setCurrentReaction] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [mood, setMood] = useState("");

  // CRITICAL: Emoji mapping objects
  const statusEmojis = {
    online: "",
    offline: "", 
    warning: "",
    error: "",
    maintenance: "",
    success: ""
  };

  const moodEmojis = {
    happy: "",
    sad: "",
    excited: "",
    angry: "",
    surprised: "",
    thinking: ""
  };

  // CRITICAL: Functions that return emoji strings
  const getStatusIcon = useCallback((statusType) => {
    return statusEmojis[statusType] || "";
  }, []);

  const generateRandomEmoji = () => {
    const emojis = ["", "", "", "", "", "", "", ""];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div style={{
      border: "2px solid #e1e5e9",
      borderRadius: "12px",
      padding: "20px",
      margin: "16px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      {/* CRITICAL: Emoji in JSX text content */}
      <h3>{icon} {title}</h3>
      <div style={{ fontSize: "24px", margin: "12px 0" }}>
        Status: {getStatusIcon(status)} 
        <span style={{ marginLeft: "10px" }}>{status}</span>
      </div>
      
      <p>{message}</p>
      
      {/* CRITICAL: Emoji in form inputs */}
      <div style={{ margin: "16px 0" }}>
        <label>Your mood: {mood}</label>
        <select 
          value={mood} 
          onChange={(e) => setMood(e.target.value)}
          style={{ marginLeft: "10px", padding: "4px" }}
        >
          {Object.entries(moodEmojis).map(([key, emoji]) => (
            <option key={key} value={emoji}>
              {emoji} {key}
            </option>
          ))}
        </select>
      </div>

      {/* CRITICAL: Emoji reaction buttons */}
      <div style={{ margin: "16px 0" }}>
        <p>React: {currentReaction}</p>
        <div>
          {reactions.map((emoji, index) => (
            <button
              key={index}
              onClick={() => setCurrentReaction(emoji)}
              style={{
                fontSize: "20px",
                margin: "4px",
                padding: "8px 12px",
                border: currentReaction === emoji ? "2px solid #007bff" : "1px solid #ccc",
                borderRadius: "6px",
                background: currentReaction === emoji ? "#e3f2fd" : "white",
                cursor: "pointer"
              }}
            >
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setCurrentReaction(generateRandomEmoji())}
            style={{
              fontSize: "16px",
              margin: "4px",
              padding: "8px 12px",
              border: "1px solid #28a745",
              borderRadius: "6px",
              backgroundColor: "#d4edda",
              cursor: "pointer"
            }}
          >
             Random
          </button>
        </div>
      </div>

      {/* CRITICAL: Emoji in text input placeholder and value */}
      <div style={{ margin: "16px 0" }}>
        <input
          type="text"
          placeholder=" Leave your feedback..."
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px"
          }}
        />
        {userFeedback && (
          <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
             Feedback: {userFeedback} {currentReaction}
          </p>
        )}
      </div>
    </div>
  );
};

// VIOLATION 2: Navigation และ Menu Components ที่มี Emoji
const EmojiNavigation = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // CRITICAL: Navigation items with emoji icons
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "", badge: null },
    { id: "users", label: "Users", icon: "", badge: "12" },
    { id: "analytics", label: "Analytics", icon: "", badge: "new" },
    { id: "messages", label: "Messages", icon: "", badge: "5" },
    { id: "notifications", label: "Notifications", icon: "", badge: "99+" },
    { id: "settings", label: "Settings", icon: "", badge: null },
    { id: "help", label: "Help & Support", icon: "", badge: null },
    { id: "logout", label: "Logout", icon: "", badge: null }
  ];

  const getBadgeEmoji = (badgeValue) => {
    if (!badgeValue) return "";
    if (badgeValue === "new") return "";
    if (badgeValue.includes("+")) return "";
    return "";
  };

  return (
    <nav style={{
      backgroundColor: "#2c3e50",
      padding: "20px 0",
      minHeight: "100vh",
      width: "250px"
    }}>
      {/* CRITICAL: Header with emoji */}
      <div style={{ 
        padding: "0 20px 20px", 
        borderBottom: "1px solid #34495e",
        marginBottom: "20px"
      }}>
        <h2 style={{ color: "white", margin: "0" }}>
           MyApp Dashboard
        </h2>
        <p style={{ color: "#bdc3c7", fontSize: "14px", margin: "8px 0 0" }}>
          Welcome back! 
        </p>
      </div>

      {/* CRITICAL: Navigation items with emoji icons */}
      {navigationItems.map(item => (
        <div
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          style={{
            padding: "12px 20px",
            cursor: "pointer",
            backgroundColor: activeSection === item.id ? "#3498db" : "transparent",
            color: activeSection === item.id ? "white" : "#ecf0f1",
            borderLeft: activeSection === item.id ? "4px solid #2980b9" : "4px solid transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (activeSection !== item.id) {
              e.target.style.backgroundColor = "#34495e";
            }
          }}
          onMouseLeave={(e) => {
            if (activeSection !== item.id) {
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "18px", marginRight: "12px" }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
          
          {item.badge && (
            <div style={{
              backgroundColor: item.badge === "new" ? "#e74c3c" : "#e67e22",
              color: "white",
              fontSize: "11px",
              padding: "2px 8px",
              borderRadius: "12px",
              fontWeight: "bold"
            }}>
              {getBadgeEmoji(item.badge)} {item.badge}
            </div>
          )}
        </div>
      ))}

      {/* CRITICAL: Status indicator with emoji */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        right: "20px",
        padding: "12px",
        backgroundColor: "#27ae60",
        borderRadius: "8px",
        color: "white",
        textAlign: "center",
        fontSize: "14px"
      }}>
         System Status: All Good! 
      </div>
    </nav>
  );
};

// VIOLATION 3: Data Display Components ที่มี Emoji
const UserProfileCard = ({ user }) => {
  const [isOnline, setIsOnline] = useState(user.isOnline || false);
  const [currentActivity, setCurrentActivity] = useState(user.activity || "");

  // CRITICAL: Activity status with emoji mapping
  const activityEmojis = {
    coding: "",
    meeting: "", 
    coffee: "",
    lunch: "",
    vacation: "",
    sick: "",
    busy: "",
    available: ""
  };

  const roleEmojis = {
    admin: "",
    manager: "",
    developer: "", 
    designer: "",
    tester: "",
    user: ""
  };

  // CRITICAL: Mood and status calculation with emojis
  const getUserMoodEmoji = useMemo(() => {
    const now = new Date().getHours();
    if (now < 9) return ""; // Early morning
    if (now < 12) return ""; // Morning coffee
    if (now < 14) return ""; // Productive time  
    if (now < 17) return ""; // Focus time
    if (now < 20) return ""; // Evening
    return ""; // Night
  }, []);

  const getPerformanceEmoji = (score) => {
    if (score >= 90) return "";
    if (score >= 80) return "";
    if (score >= 70) return "";
    if (score >= 60) return "";
    return "";
  };

  return (
    <div style={{
      border: "1px solid #e1e8ed",
      borderRadius: "16px",
      padding: "24px",
      margin: "16px",
      backgroundColor: "white",
      boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      maxWidth: "400px"
    }}>
      {/* CRITICAL: Profile header with emoji */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <div style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#f0f2f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          marginRight: "16px"
        }}>
          {user.avatar || ""}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 4px", color: "#1d2129" }}>
            {roleEmojis[user.role] || ""} {user.name}
          </h3>
          <p style={{ margin: "0", color: "#65676b", fontSize: "14px" }}>
            {user.title} • {user.department}
          </p>
        </div>
        
        <div style={{ textAlign: "right" }}>
          <div style={{
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "12px",
            backgroundColor: isOnline ? "#e8f5e8" : "#f5e8e8",
            fontSize: "12px",
            fontWeight: "bold",
            color: isOnline ? "#2e7d2e" : "#7d2e2e"
          }}>
            {isOnline ? " Online" : " Offline"}
          </div>
        </div>
      </div>

      {/* CRITICAL: User stats with emoji indicators */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        margin: "16px 0"
      }}>
        <div style={{
          padding: "12px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "20px" }}></div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#495057" }}>
            {user.projectsCount || 0}
          </div>
          <div style={{ fontSize: "12px", color: "#6c757d" }}>Projects</div>
        </div>
        
        <div style={{
          padding: "12px",
          backgroundColor: "#f8f9fa", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "20px" }}>
            {getPerformanceEmoji(user.performanceScore || 0)}
          </div>
          <div style={{ fontSize: "18px", fontWeight: "bold", color: "#495057" }}>
            {user.performanceScore || 0}%
          </div>
          <div style={{ fontSize: "12px", color: "#6c757d" }}>Performance</div>
        </div>
      </div>

      {/* CRITICAL: Current activity with emoji */}
      <div style={{ margin: "16px 0" }}>
        <p style={{ fontSize: "14px", color: "#65676b", margin: "0 0 8px" }}>
          Current Status:
        </p>
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          border: "1px solid #bbdefb"
        }}>
          <span style={{ fontSize: "16px", marginRight: "8px" }}>
            {activityEmojis[currentActivity] || ""}
          </span>
          <span style={{ fontSize: "14px", color: "#1976d2" }}>
            {currentActivity || "Available"} {getUserMoodEmoji}
          </span>
        </div>
      </div>

      {/* CRITICAL: Action buttons with emoji */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginTop: "20px"
      }}>
        <button style={{
          flex: 1,
          padding: "8px 12px",
          backgroundColor: "#1877f2",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer"
        }}>
           Message
        </button>
        <button style={{
          flex: 1,
          padding: "8px 12px",
          backgroundColor: "#42b883",
          color: "white", 
          border: "none",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer"
        }}>
           Call
        </button>
        <button style={{
          padding: "8px 12px",
          backgroundColor: "#f8f9fa",
          color: "#495057",
          border: "1px solid #dee2e6",
          borderRadius: "6px",
          fontSize: "14px",
          cursor: "pointer"
        }}>
          
        </button>
      </div>

      {/* CRITICAL: Recent activity with timestamps and emojis */}
      <div style={{ marginTop: "20px" }}>
        <h4 style={{ fontSize: "14px", color: "#65676b", margin: "0 0 12px" }}>
           Recent Activity
        </h4>
        <div style={{ fontSize: "12px" }}>
          {[
            { time: "2 hours ago", action: " Deployed new feature", emoji: "" },
            { time: "4 hours ago", action: " Updated documentation", emoji: "" },
            { time: "1 day ago", action: " Fixed critical bug", emoji: "" }
          ].map((activity, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 0",
              borderBottom: index < 2 ? "1px solid #f1f3f4" : "none"
            }}>
              <span style={{ marginRight: "8px" }}>{activity.emoji}</span>
              <span style={{ flex: 1, color: "#495057" }}>{activity.action}</span>
              <span style={{ color: "#6c757d" }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// VIOLATION 4: Form Components ที่มี Emoji Validation
const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    message: "",
    category: "",
    mood: ""
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // CRITICAL: Rating system with emoji
  const ratingEmojis = ["", "", "", "", ""];
  const categories = [
    { id: "bug", label: " Bug Report", color: "#e74c3c" },
    { id: "feature", label: " Feature Request", color: "#3498db" },
    { id: "improvement", label: " Improvement", color: "#f39c12" },
    { id: "compliment", label: " Compliment", color: "#27ae60" },
    { id: "complaint", label: " Complaint", color: "#e67e22" }
  ];

  // CRITICAL: Validation with emoji responses
  const validateForm = () => {
    const newErrors = {};
    
    if (!feedback.message.trim()) {
      newErrors.message = " Please enter your feedback message";
    } else if (feedback.message.length < 10) {
      newErrors.message = " Message should be at least 10 characters long";
    }
    
    if (!feedback.category) {
      newErrors.category = " Please select a feedback category";
    }
    
    if (feedback.rating < 1 || feedback.rating > 5) {
      newErrors.rating = " Rating must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setSubmitted(true);
      console.log("Feedback submitted:", feedback);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFeedback({ rating: 5, message: "", category: "", mood: "" });
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#d4edda",
        border: "1px solid #c3e6cb",
        borderRadius: "12px",
        margin: "20px"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}></div>
        <h2 style={{ color: "#155724", margin: "0 0 8px" }}>
          Thank You! 
        </h2>
        <p style={{ color: "#155724", margin: "0" }}>
          Your feedback has been submitted successfully! 
        </p>
        <div style={{ fontSize: "24px", marginTop: "16px" }}>
          {feedback.mood}  
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: "500px",
      margin: "20px auto",
      padding: "24px",
      border: "1px solid #e1e8ed",
      borderRadius: "12px",
      backgroundColor: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#1d2129", marginBottom: "24px" }}>
         Share Your Feedback
      </h2>

      {/* CRITICAL: Rating with emoji display */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
           Rate Your Experience
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => setFeedback(prev => ({ ...prev, rating }))}
              style={{
                fontSize: "32px",
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "4px",
                opacity: rating <= feedback.rating ? 1 : 0.3,
                transition: "opacity 0.2s"
              }}
            >
              {ratingEmojis[rating - 1]}
            </button>
          ))}
          <span style={{ marginLeft: "12px", fontSize: "18px" }}>
            {ratingEmojis[feedback.rating - 1]} {feedback.rating}/5
          </span>
        </div>
        {errors.rating && (
          <p style={{ color: "#e74c3c", fontSize: "14px", margin: "4px 0 0" }}>
            {errors.rating}
          </p>
        )}
      </div>

      {/* CRITICAL: Category selection with emoji labels */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
           Feedback Category
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {categories.map(category => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFeedback(prev => ({ ...prev, category: category.id }))}
              style={{
                padding: "8px 12px",
                border: `2px solid ${feedback.category === category.id ? category.color : "#e1e8ed"}`,
                borderRadius: "8px",
                backgroundColor: feedback.category === category.id ? `${category.color}20` : "white",
                color: feedback.category === category.id ? category.color : "#495057",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s"
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
        {errors.category && (
          <p style={{ color: "#e74c3c", fontSize: "14px", margin: "4px 0 0" }}>
            {errors.category}
          </p>
        )}
      </div>

      {/* CRITICAL: Message input with emoji placeholder */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
           Your Message
        </label>
        <textarea
          value={feedback.message}
          onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
          placeholder=" Tell us what's on your mind... We'd love to hear from you! "
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "12px",
            border: `1px solid ${errors.message ? "#e74c3c" : "#e1e8ed"}`,
            borderRadius: "8px",
            fontSize: "14px",
            resize: "vertical"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          {errors.message && (
            <p style={{ color: "#e74c3c", fontSize: "12px", margin: "0" }}>
              {errors.message}
            </p>
          )}
          <span style={{ 
            fontSize: "12px", 
            color: feedback.message.length < 10 ? "#e74c3c" : "#6c757d",
            marginLeft: "auto"
          }}>
            {feedback.message.length < 10 ? "" : ""} {feedback.message.length} characters
          </span>
        </div>
      </div>

      {/* CRITICAL: Mood selector with emoji */}
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
           Current Mood
        </label>
        <select
          value={feedback.mood}
          onChange={(e) => setFeedback(prev => ({ ...prev, mood: e.target.value }))}
          style={{
            padding: "8px 12px",
            border: "1px solid #e1e8ed",
            borderRadius: "8px",
            fontSize: "14px",
            backgroundColor: "white"
          }}
        >
          <option value=""> Happy</option>
          <option value=""> Excited</option>
          <option value=""> Neutral</option>
          <option value=""> Disappointed</option>
          <option value=""> Frustrated</option>
          <option value=""> Thoughtful</option>
        </select>
      </div>

      {/* CRITICAL: Submit button with emoji */}
      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#1877f2",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#166fe5"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "#1877f2"}
      >
         Submit Feedback
      </button>
    </form>
  );
};

// Main App Component
const EmojiApp = () => {
  const [currentUser] = useState({
    name: "John Doe",
    title: "Senior Developer", 
    department: "Engineering",
    role: "developer",
    avatar: "",
    isOnline: true,
    activity: "coding",
    projectsCount: 15,
    performanceScore: 92
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <EmojiNavigation />
      
      <div style={{ flex: 1, padding: "20px", overflow: "auto" }}>
        <h1 style={{ color: "#1d2129", marginBottom: "24px" }}>
           Welcome to the Dashboard! 
        </h1>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <EmojiStatusCard 
            title="System Status"
            status="online"
            message="All systems running smoothly! "
            reactions={["", "", "", "", ""]}
          />
          
          <EmojiStatusCard 
            title="Performance Metrics"
            status="success" 
            icon=""
            message="Great performance today! Keep it up! "
            reactions={["", "", "", ""]}
          />
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <UserProfileCard user={currentUser} />
          <FeedbackForm />
        </div>
      </div>
    </div>
  );
};

export default EmojiApp;