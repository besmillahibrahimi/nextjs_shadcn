type Menu = {
  label: React.ReactNode;
  icon: string;
  href?: string;
  notifications?: number;
  isActive?: boolean;
};

type MenuParent = Menu & {
  type: "dropdown" | "collapsible";
  menus: Menu[];
};

type MenuGroup = {
  label: React.ReactNode;
  icon: string;
  href?: string;
  menus: (Menu | MenuParent)[];
};
