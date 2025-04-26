export const menus: MenuGroup[] = [
  {
    label: "MAIN",
    icon: "mdi:menu",
    href: "#",
    menus: [
      {
        label: "Lab",
        icon: "mdi:flask",
        href: "/lab",
      },
      {
        label: "Conversations",
        icon: "mdi:chat",
        href: "/conversations",
      },
      {
        label: "Analytics",
        icon: "mdi:chart-bar",
        href: "/analytics",
      },
      {
        label: "Scripts",
        icon: "mdi:script",
        href: "/scripts",
      },
      {
        label: "Tutorial",
        icon: "mdi:play-circle",
        href: "/tutorial",
      },
      {
        label: "Feedback",
        icon: "mdi:message",
        href: "/feedback",
      },
      {
        label: "Contact Support",
        icon: "mdi:headset",
        href: "/contact-support",
      },
      {
        label: "Billing & Usage",
        icon: "mdi:credit-card",
        href: "/billing-usage",
      },
    ],
  },
  {
    label: "SETTINGS",
    icon: "mdi:cog",
    type: "dropdown",
    href: "#",
    menus: [
      {
        label: "Account",
        icon: "mdi:account",
        href: "/account",
        type: "collapsible",
        menus: [
          {
            label: "Profile",
            icon: "mdi:account",
            href: "/profile",
          },
          {
            label: "Settings",
            icon: "mdi:cog",
            href: "/settings",
          },
        ],
      },
      {
        label: "Appearance",
        icon: "mdi:palette",
        href: "/appearance",
        type: "dropdown",
        menus: [
          {
            label: "Theme",
            icon: "mdi:theme-light-dark",
            href: "/theme",
          },
          {
            label: "Font",
            icon: "mdi:format-font",
            href: "/font",
          },
        ],
      },
      {
        label: "Notifications",
        icon: "mdi:bell",
        href: "/notifications",
      },
      {
        label: "Language",
        icon: "mdi:translate",
        href: "/language",
      },
      {
        label: "Security",
        icon: "mdi:shield",
        href: "/security",
      },
      {
        label: "Privacy",
        icon: "mdi:lock",
        href: "/privacy",
      },
      {
        label: "Help",
        icon: "mdi:help-circle",
        href: "/help",
      },
      {
        label: "About",
        icon: "mdi:information",
        href: "/about",
      },
    ],
  },
];
