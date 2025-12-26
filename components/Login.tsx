import React, { useState, useEffect } from 'react';
import { Card } from './ui';
import { UserRole, User } from '../types';
import { MOCK_STUDENTS } from '../constants';

type LoginProps = {
    onLogin: (user: Partial<User> & { role: UserRole }) => void;
};

const Login = ({ onLogin }: LoginProps) => {
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Teacher: store selected teacher name
    const [selectedTeacherName, setSelectedTeacherName] = useState<string>('');
    const [selectedMentor, setSelectedMentor] = useState<string>('Seema Mam');
    
    // Teacher credentials map (name -> { username, password, subject })
    const teacherCreds: Array<{ name: string; username: string; password: string; subject: string }> = [
        { subject: 'Business Statistics', name: 'Dr. S. Nanthitha', username: 'nanthitha', password: 'Nanthitha@123' },
        { subject: 'Foundation of Data Science', name: 'Ms. Padmapriya', username: 'padmapriya', password: 'Padmapriya@123' },
        { subject: 'Full Stack Development', name: 'Dr. A. Priya', username: 'apriya', password: 'Priya@123' },
        { subject: 'Financial and Cost Accounting', name: 'Dr. K. Kirishnamoorthy', username: 'krishnamoorthy', password: 'Krishnamoorthy@123' },
        { subject: 'Business Process Management', name: 'Ms. S. Hemalatha', username: 'hemalatha', password: 'Hemalatha@123' },
        { subject: 'Robotics', name: 'Dr. R. Saravanan', username: 'saravanan', password: 'Saravanan@123' },
        { subject: 'Foundation of Data Science Lab', name: 'Mr. P. TamilArasu', username: 'tamilarasu', password: 'Tamilarasu@123' },
        { subject: 'Full Stack Development Lab', name: 'Ms. M. Divya', username: 'divya', password: 'Divya@123' },
    ];

    // Mentor credentials map (name -> { username, password })
    const mentorCreds: Record<string, { username: string; password: string }> = {
        'Seema Mam': { username: 'Seema', password: 'Seema@123' },
        'Tamilarasu Sir': { username: 'Tamilarasu', password: 'Tamilarasu@123' },
        'Priya Mam': { username: 'Priya', password: 'Priya@123' },
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (role === UserRole.STUDENT) {
            const student = MOCK_STUDENTS.find(s => s.username.toLowerCase() === username.toLowerCase());
            if (student && student.password === password) {
                onLogin({ role: UserRole.STUDENT, name: student.name, id: student.rollNo });
            } else {
                alert('Invalid username or password.');
            }
            return;
        }

        if (role === UserRole.TEACHER) {
            const entry = teacherCreds.find(t => t.name === selectedTeacherName);
            if (!entry) {
                alert('Please select a teacher');
                return;
            }
            if (password !== entry.password) {
                alert('Invalid password for the selected teacher.');
                return;
            }
            onLogin({
                role: UserRole.TEACHER,
                name: entry.name,
                id: entry.username,
                subjectHandled: entry.subject,
            });
            return;
        }

        if (role === UserRole.MENTOR) {
            const creds = mentorCreds[selectedMentor];
            if (creds && password === creds.password) {
                onLogin({ role: UserRole.MENTOR, name: selectedMentor });
            } else {
                alert('Invalid mentor password.');
            }
            return;
        }

        // Admin
        onLogin({ role: UserRole.ADMIN, name: username || 'Admin User' });
    };

    useEffect(() => {
        setUsername('');
        setPassword('');
        if (role === UserRole.TEACHER) {
            setSelectedTeacherName(teacherCreds[0]?.name ?? '');
        } else if (role === UserRole.ADMIN) {
            setUsername('Admin User');
        }
    }, [role]);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md">
                <Card>
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-2">MyCampus</h1>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Sign in to continue</p>
                        
                        <form onSubmit={handleLogin} className="space-y-6">
                             <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Login as</label>
                                <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white">
                                    <option value={UserRole.STUDENT}>Student</option>
                                    <option value={UserRole.TEACHER}>Teacher</option>
                                    <option value={UserRole.MENTOR}>Mentor</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                </select>
                            </div>

                            {role === UserRole.TEACHER ? (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Teacher</label>
                                    <select
                                      value={selectedTeacherName}
                                      onChange={e => { setSelectedTeacherName(e.target.value); setPassword(''); }}
                                      className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                                    >
                                      {teacherCreds.map(t => (
                                        <option key={t.username} value={t.name}>{t.name}</option>
                                      ))}
                                    </select>
                                </div>
                            ) : role === UserRole.MENTOR ? (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mentor</label>
                                    <select value={selectedMentor} onChange={e => setSelectedMentor(e.target.value)} className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white">
                                        {Object.keys(mentorCreds).map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-baseline">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                    <a href="#" onClick={() => alert('Redirecting to password reset flow...')} className="text-sm text-indigo-600 hover:underline">Forgot Password?</a>
                                </div>
                                {role === UserRole.STUDENT && (
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
                                )}
                                {role === UserRole.TEACHER && (
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
                                )}
                                {role === UserRole.MENTOR && (
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
                                )}
                                {role === UserRole.ADMIN && (
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white" />
                                )}
                            </div>
                            <div>
                                <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors">Login</button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Login;
