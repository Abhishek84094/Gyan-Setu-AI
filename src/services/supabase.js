import { createClient } from '@supabase/supabase-js';
import { questions as coreQuestions } from '../data/questions';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize client if credentials exist, otherwise load Mock DB
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// --- MOCK DATABASE IMPLEMENTATION FOR LOCAL DEVELOPMENT ---
const MOCK_STORAGE_KEY = 'gyansetu_mock_db';

const getMockDB = () => {
  let db = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!db) {
    db = {
      users: [
        { id: 't1', name: 'Alok Mishra (Math Teacher)', email: 'teacher@gyansetu.in', role: 'teacher', class_id: 'c1' },
        { id: 's1', name: 'Rishabh (Student)', email: 'student@gyansetu.in', role: 'student', class_id: 'c1' },
        { id: 'p1', name: 'Sanjay Kumar (Parent)', email: 'parent@gyansetu.in', role: 'parent', linked_student_id: 's1' }
      ],
      classes: [
        { id: 'c1', class_name: 'Class 10-A (CBSE Mathematics)' }
      ],
      questions: coreQuestions.map(q => ({
        id: q.id,
        question_text: q.question,
        sub_topic: q.subTopic,
        difficulty: q.difficulty,
        marks: q.marks,
        model_solution: q.modelSolution,
        expected_answer: q.expectedAnswer,
        created_by: 't1'
      })),
      submissions: [
        {
          id: 'sub_test_1',
          student_id: 's1',
          question_id: 1,
          input_type: 'type',
          student_answer: 'Let coefficients be a=2, b=-4, c=3. Discriminant D = b^2 - 4ac = 16 - 4*2*3 = 16 - 24 = -8. Since discriminant D is less than zero, the roots are not real, they are imaginary.',
          scored_marks: 1.0,
          total_marks: 1,
          steps_feedback: [
            { stepNumber: 1, description: "Identify coefficients a = 2, b = -4, c = 3.", maxMarks: 0.5, scoredMarks: 0.5, feedback: "Correct coefficients." },
            { stepNumber: 2, description: "Calculate Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, roots are imaginary (no real roots).", maxMarks: 0.5, scoredMarks: 0.5, feedback: "Perfect discriminant calculation and root description." }
          ],
          general_feedback: "Excellent! Covered all key steps correctly.",
          graded_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'sub_test_2',
          student_id: 's1',
          question_id: 11,
          input_type: 'voice',
          student_answer: 'Solving x squared minus 3x minus 10 equals 0. I split the middle term, but I got x = 5 only. I forgot the other root.',
          scored_marks: 1.0,
          total_marks: 2,
          steps_feedback: [
            { stepNumber: 1, description: "Split the middle term: x² - 5x + 2x - 10 = 0.", maxMarks: 1.0, scoredMarks: 0.5, feedback: "Partial credit: Splitting method outlined correctly." },
            { stepNumber: 2, description: "Factorize: x(x - 5) + 2(x - 5) = 0 => (x - 5)(x + 2) = 0. Therefore, roots are x = 5 and x = -2.", maxMarks: 1.0, scoredMarks: 0.5, feedback: "Found x = 5, but missed root x = -2." }
          ],
          general_feedback: "Good try. Don't forget that quadratic equations always have two roots. Factor thoroughly.",
          graded_at: new Date(Date.now() - 3600000 * 24).toISOString()
        }
      ]
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
  } else {
    db = JSON.parse(db);
    // If the mock database questions array is outdated (i.e. has less than 40 questions), automatically refresh it with all 40 questions!
    if (!db.questions || db.questions.length < 40) {
      db.questions = coreQuestions.map(q => ({
        id: q.id,
        question_text: q.question,
        sub_topic: q.subTopic,
        difficulty: q.difficulty,
        marks: q.marks,
        model_solution: q.modelSolution,
        expected_answer: q.expectedAnswer,
        created_by: 't1'
      }));
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
    }
  }
  return db;
};

const saveMockDB = (db) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(db));
};

// --- AUTHENTICATION ACTIONS ---
export async function signUp({ email, password, name, role, classCode, className, linkedStudentEmail }) {
  if (isSupabaseConfigured) {
    // 1. Supabase Auth signup (passing role metadata to database triggers)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          name,
          role
        } 
      }
    });
    if (authError) throw authError;
    const user = authData.user;

    // Resolve class code or linked student
    let resolvedClassId = null;
    let resolvedLinkedStudentId = null;

    if (role === 'student' && classCode) {
      const { data: classData } = await supabase.from('classes').select('id').eq('id', classCode).maybeSingle();
      if (classData) resolvedClassId = classData.id;
    } else if (role === 'teacher') {
      // Automatically create a default class for the teacher if it doesn't exist
      const { data: newClass, error: classErr } = await supabase
        .from('classes')
        .insert({ class_name: className || 'Class 10-A (CBSE Mathematics)' })
        .select()
        .single();
      if (!classErr && newClass) {
        resolvedClassId = newClass.id;
      }
    } else if (role === 'parent' && linkedStudentEmail) {
      const { data: studentProfile } = await supabase.from('users').select('id').eq('email', linkedStudentEmail).maybeSingle();
      if (studentProfile) resolvedLinkedStudentId = studentProfile.id;
    }

    // 2. Upsert profile in our public users table (prevents conflicts with database triggers)
    const { error: profileError } = await supabase.from('users').upsert({
      id: user.id,
      name,
      email,
      role,
      class_id: resolvedClassId,
      linked_student_id: resolvedLinkedStudentId
    });
    if (profileError) throw profileError;

    // Fetch and return the fully populated flattened profile
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
    return { ...user, ...profile };
  } else {
    // Mock Signup
    const db = getMockDB();
    const existing = db.users.find(u => u.email === email);
    if (existing) throw new Error("User already exists with this email.");

    let resolvedClassId = classCode || null;
    let resolvedLinkedStudentId = null;

    if (role === 'parent' && linkedStudentEmail) {
      const student = db.users.find(u => u.email === linkedStudentEmail && u.role === 'student');
      if (student) resolvedLinkedStudentId = student.id;
    }

    const mockUser = {
      id: 'mock_uid_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
      class_id: resolvedClassId,
      linked_student_id: resolvedLinkedStudentId
    };

    db.users.push(mockUser);
    saveMockDB(db);
    localStorage.setItem('gyansetu_active_user', JSON.stringify(mockUser));
    return mockUser;
  }
}

export async function signIn({ email, password }) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Fetch profile and merge flatly to override default auth "authenticated" role
    const { data: profile, error: profileError } = await supabase.from('users').select('*').eq('id', data.user.id).single();
    if (profileError) throw profileError;

    return { ...data.user, ...profile };
  } else {
    // Mock Login
    const db = getMockDB();
    const user = db.users.find(u => u.email === email);
    if (!user) throw new Error("Invalid login credentials.");

    localStorage.setItem('gyansetu_active_user', JSON.stringify(user));
    return user;
  }
}

export async function signOut() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut();
  } else {
    localStorage.removeItem('gyansetu_active_user');
  }
}

export async function getCurrentUser() {
  if (isSupabaseConfigured) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
    return { ...user, ...profile };
  } else {
    const saved = localStorage.getItem('gyansetu_active_user');
    return saved ? JSON.parse(saved) : null;
  }
}

// --- DATABASE ACTIONS ---

// Get list of questions
export async function getQuestions() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    
    // If the database has less than 40 questions, automatically seed the missing ones!
    if (data && data.length < 40) {
      const existingIds = data.map(q => q.id);
      const missingQuestions = coreQuestions.filter(q => !existingIds.includes(q.id));
      
      if (missingQuestions.length > 0) {
        console.log(`[Supabase Client] Auto-seeding ${missingQuestions.length} missing questions to database...`);
        const insertPayload = missingQuestions.map(q => ({
          id: q.id,
          question_text: q.question,
          sub_topic: q.subTopic,
          difficulty: q.difficulty,
          marks: q.marks,
          model_solution: q.modelSolution,
          expected_answer: q.expectedAnswer
        }));
        
        const { error: seedError } = await supabase.from('questions').insert(insertPayload);
        if (!seedError) {
          // Re-fetch questions to return the complete database list
          const { data: refetched } = await supabase
            .from('questions')
            .select('*')
            .order('id', { ascending: true });
          return refetched || data;
        } else {
          console.warn("Auto-seeding questions failed: ", seedError.message);
        }
      }
    }
    
    return data;
  } else {
    const db = getMockDB();
    return db.questions;
  }
}

// Add a question (Teacher action)
export async function addQuestion(questionData) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const db = getMockDB();
    const newQuestion = {
      id: db.questions.length + 1,
      ...questionData,
      created_at: new Date().toISOString()
    };
    db.questions.push(newQuestion);
    saveMockDB(db);
    return newQuestion;
  }
}

// Get student submissions
export async function getSubmissions(studentId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*, questions(question_text, sub_topic, marks)')
      .eq('student_id', studentId)
      .order('graded_at', { ascending: false });
    if (error) throw error;
    return data;
  } else {
    const db = getMockDB();
    const userSubmissions = db.submissions.filter(s => s.student_id === studentId);
    return userSubmissions.map(s => {
      const q = db.questions.find(qItem => qItem.id === s.question_id);
      return {
        ...s,
        questions: q ? { question_text: q.question_text, sub_topic: q.sub_topic, marks: q.marks } : null
      };
    });
  }
}

// Add student submission
export async function addSubmission(submissionData) {
  if (isSupabaseConfigured) {
    // 1. Ensure the question exists in the database questions table to satisfy the foreign key constraint
    const { data: qExists, error: qCheckErr } = await supabase
      .from('questions')
      .select('id')
      .eq('id', submissionData.question_id)
      .maybeSingle();

    if (!qExists) {
      // Find matching question details in core questions list
      const coreQ = coreQuestions.find(q => q.id === submissionData.question_id);
      if (coreQ) {
        await supabase.from('questions').insert({
          id: coreQ.id,
          question_text: coreQ.question,
          sub_topic: coreQ.subTopic,
          difficulty: coreQ.difficulty,
          marks: coreQ.marks,
          model_solution: coreQ.modelSolution,
          expected_answer: coreQ.expectedAnswer
        });
      }
    }

    // 2. Insert the submission
    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const db = getMockDB();
    const newSub = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      ...submissionData,
      graded_at: new Date().toISOString()
    };
    db.submissions.push(newSub);
    saveMockDB(db);
    return newSub;
  }
}

// Get all students for a class (Teacher action)
export async function getClassStudents(classId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'student')
      .eq('class_id', classId);
    if (error) throw error;
    return data;
  } else {
    const db = getMockDB();
    return db.users.filter(u => u.role === 'student' && u.class_id === classId);
  }
}

// Get parent's linked child profile
export async function getLinkedStudentProfile(linkedStudentId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', linkedStudentId)
      .single();
    if (error) throw error;
    return data;
  } else {
    const db = getMockDB();
    return db.users.find(u => u.id === linkedStudentId) || null;
  }
}
