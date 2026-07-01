"use client";

import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Header() {
  const pathname = usePathname();

  const navLinks: NavLink[] = [
    {
      label: "Boards",
      href: "/boards",
      icon: <DashboardIcon sx={{ mr: 0.5 }} />,
    },
    {
      label: "Users",
      href: "/users",
      icon: <GroupIcon sx={{ mr: 0.5 }} />,
    },
  ];

  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              minWidth: 120,
              color: "primary.main",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            Ascendo
          </Typography>
        </Link>

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  color: isActive(link.href) ? "primary.main" : "text.primary",
                  borderBottom: isActive(link.href)
                    ? "2px solid"
                    : "2px solid transparent",
                  borderColor: isActive(link.href) ? "primary.main" : "transparent",
                  paddingBottom: "4px",
                  transition: "all 0.2s ease-in-out",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: isActive(link.href) ? 600 : 500,
                  "&:hover": {
                    color: "primary.main",
                    borderColor: "primary.main",
                  },
                }}
              >
                {link.icon}
                {link.label}
              </Box>
            </Link>
          ))}
        </Box>

        {/* Avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          N
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}