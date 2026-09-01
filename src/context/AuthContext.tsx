import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

export interface DemoAccount {
  role: UserRole;
  email: string;
  name: string;
  nameAr: string;
  title: string;
  titleAr: string;
  badgeColor: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'SUPER_ADMIN',
    email: 'admin@vendingfleet.com',
    name: 'Sultan Al-Otaibi',
    nameAr: 'سلطان العتيبي',
    title: 'Super Administrator',
    titleAr: 'مدير عام النظام',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  },
  {
    role: 'MAINTENANCE_MANAGER',
    email: 'manager@vendingfleet.com',
    name: 'Faisal Al-Ghamdi',
    nameAr: 'فيصل الغامدي',
    title: 'Maintenance Operations Manager',
    titleAr: 'مدير عمليات الصيانة',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  },
  {
    role: 'TECHNICIAN',
    email: 'tech@vendingfleet.com',
    name: 'Tariq Al-Mansoor',
    nameAr: 'طارق المنصور',
    title: 'Lead Field Specialist',
    titleAr: 'فني صيانة ميداني أول',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    role: 'WAREHOUSE',
    email: 'warehouse@vendingfleet.com',
    name: 'Yousef Al-Harbi',
    nameAr: 'يوسف الحربي',
    title: 'Spare Parts & Inventory Custodian',
    titleAr: 'أمين ومسؤول المستودع',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  },
  {
    role: 'MANAGEMENT',
    email: 'facility@vendingfleet.com',
    name: 'Nora Al-Zahrani',
    nameAr: 'نورة الزهراني',
    title: 'Campus Facility Lead',
    titleAr: 'مشرفة الموقع والمرافق',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    role: 'VIEWER',
    email: 'viewer@vendingfleet.com',
    name: 'Sarah Al-Shehri',
    nameAr: 'سارة الشهري',
    title: 'Audit & Compliance Viewer',
    titleAr: 'مراقبة جودة وتدقيق',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsDemo: (demoAccount: DemoAccount) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
  canEditMachines: boolean;
  canManageFleet: boolean;
  canAssignTickets: boolean;
  canManageTickets: boolean;
  canManageTechnicians: boolean;
  canManageInventory: boolean;
  canIssueParts: boolean;
  canViewAudit: boolean;
  canAdminUsers: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('vending_fleet_access_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('vending_fleet_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // Default to Super Admin for seamless exploration
          const defaultDemo = DEMO_ACCOUNTS[0];
          const demoUser: User = {
            id: 'usr-admin-01',
            email: defaultDemo.email,
            fullName: defaultDemo.name,
            role: defaultDemo.role,
            phone: '+966 50 123 4567',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };
          setUser(demoUser);
          localStorage.setItem('vending_fleet_user', JSON.stringify(demoUser));
          localStorage.setItem('vending_fleet_access_token', 'demo-jwt-token-production-active');
          setAccessToken('demo-jwt-token-production-active');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Find matching demo or create authenticated session
      const matchedDemo = DEMO_ACCOUNTS.find(d => d.email.toLowerCase() === email.toLowerCase());
      
      const loggedUser: User = {
        id: matchedDemo ? `usr-${matchedDemo.role.toLowerCase()}` : `usr-${Date.now()}`,
        email: email,
        fullName: matchedDemo ? matchedDemo.name : email.split('@')[0].replace('.', ' '),
        role: matchedDemo ? matchedDemo.role : 'MAINTENANCE_MANAGER',
        phone: '+966 55 000 0000',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      const token = `jwt-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      setUser(loggedUser);
      setAccessToken(token);
      localStorage.setItem('vending_fleet_user', JSON.stringify(loggedUser));
      localStorage.setItem('vending_fleet_access_token', token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = (demo: DemoAccount) => {
    const demoUser: User = {
      id: `usr-${demo.role.toLowerCase()}`,
      email: demo.email,
      fullName: demo.name,
      role: demo.role,
      phone: '+966 50 987 6543',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const token = `jwt-demo-${demo.role.toLowerCase()}-${Date.now()}`;
    setUser(demoUser);
    setAccessToken(token);
    localStorage.setItem('vending_fleet_user', JSON.stringify(demoUser));
    localStorage.setItem('vending_fleet_access_token', token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('vending_fleet_user');
    localStorage.removeItem('vending_fleet_access_token');
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roles.includes(user.role);
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canEditMachines = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER']);
  const canManageFleet = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER', 'FACILITY_MANAGER', 'MANAGEMENT']);
  const canAssignTickets = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER']);
  const canManageTickets = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER', 'TECHNICIAN']);
  const canManageTechnicians = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER']);
  const canManageInventory = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER', 'WAREHOUSE', 'WAREHOUSE_OFFICER']);
  const canIssueParts = hasRole(['SUPER_ADMIN', 'ADMIN', 'MAINTENANCE_MANAGER', 'WAREHOUSE', 'WAREHOUSE_OFFICER']);
  const canViewAudit = hasRole(['SUPER_ADMIN', 'ADMIN', 'VIEWER']);
  const canAdminUsers = hasRole(['SUPER_ADMIN']);
  const canManageUsers = hasRole(['SUPER_ADMIN', 'ADMIN']);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      accessToken,
      login,
      loginAsDemo,
      logout,
      hasRole,
      isAdmin,
      canEditMachines,
      canManageFleet,
      canAssignTickets,
      canManageTickets,
      canManageTechnicians,
      canManageInventory,
      canIssueParts,
      canViewAudit,
      canAdminUsers,
      canManageUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
