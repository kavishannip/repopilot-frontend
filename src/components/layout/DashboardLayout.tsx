'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  IconButton,
  Divider,
} from '@wso2/oxygen-ui';
import {
  Compass,
  Database,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Activity,
  Sparkles,
} from 'lucide-react';
import Navbar from './Navbar';
import { useAppStore } from '@/stores/appStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const repoUrl = useAppStore((state) => state.repoUrl);
  const deepAnalysisResult = useAppStore((state) => state.deepAnalysisResult);

  const navigationItems = [
    {
      href: '/analyze',
      label: 'Analyze',
      description: 'Single-page repository scanner',
      icon: Compass,
    },
    {
      href: '/repositories',
      label: 'Repositories',
      description: 'Scanned repository catalog',
      icon: Database,
    },
    {
      href: '/chat',
      label: 'Chat',
      description: 'Interactive repo intelligence',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-blue-600/5 blur-[140px] rounded-full" />
      </div>

      {/* Top Navbar Header */}
      <Navbar />

      {/* Main Dashboard Workspace (Left Sidebar + Content Container) */}
      <div className="relative z-10 flex flex-1 w-full h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Collapsible Sidebar */}
        <aside
          className={`relative h-full border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out shrink-0 ${
            isCollapsed ? 'w-16' : 'w-60'
          }`}
        >
          {/* Collapse / Expand Toggle Button */}
          <div className="flex items-center justify-between p-3 border-b border-slate-800/60">
            {!isCollapsed && (
              <Typography variant="overline" className="text-slate-400 font-bold text-[11px] tracking-wider uppercase pl-2">
                Navigation
              </Typography>
            )}
            <Tooltip title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'} placement="right">
              <IconButton
                size="small"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 ${
                  isCollapsed ? 'mx-auto' : ''
                }`}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </IconButton>
            </Tooltip>
          </div>

          {/* Navigation Items List using Oxygen UI List */}
          <List className="space-y-1.5 p-2 flex-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive =
                pathname === item.href ||
                (pathname === '/' && item.href === '/analyze') ||
                (item.href === '/repositories' && pathname?.startsWith('/repositories'));


              const navButton = (
                <ListItem key={item.href} disablePadding>
                  <Link href={item.href} className="w-full">
                    <ListItemButton
                      selected={isActive}
                      className={`rounded-xl transition-all py-2.5 px-3 ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <ListItemIcon className={`min-w-0 ${isCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                        <IconComponent className="h-5 w-5" />
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText
                          primary={
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{item.label}</span>
                              {item.href === '/analyze' && deepAnalysisResult && (
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                              )}
                            </div>
                          }
                        />
                      )}
                    </ListItemButton>
                  </Link>
                </ListItem>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href} title={item.label} placement="right">
                    <div>{navButton}</div>
                  </Tooltip>
                );
              }

              return navButton;
            })}
          </List>

          <Divider className="border-slate-800/80" />

          {/* Active Repo Context Widget */}
          {!isCollapsed && repoUrl && (
            <div className="p-3 m-2 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
                <Activity className="h-3.5 w-3.5" />
                <span>Active Repo</span>
              </div>
              <Typography variant="caption" className="text-slate-300 font-mono text-[11px] block truncate">
                {repoUrl.replace('https://github.com/', '')}
              </Typography>
            </div>
          )}
        </aside>

        {/* Main Content Area — Full Screen Width and Height */}
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-8 w-full max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
