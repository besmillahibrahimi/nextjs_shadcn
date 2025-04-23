import type { MantineTheme, MantineThemeOverride } from "@mantine/core";

export const components: MantineThemeOverride["components"] = {
  Button: {
    defaultProps: {
      size: "md",
      radius: "md",
    },
    styles: (theme: MantineTheme) => ({
      root: {
        fontWeight: 600,
        transition: "all 0.2s ease",
      },
    }),
  },

  TextInput: {
    defaultProps: {
      size: "md",
      radius: "md",
    },
    styles: (theme: MantineTheme) => ({
      input: {
        "&:focus": {
          borderColor: theme.colors.primary[5],
        },
      },
    }),
  },

  Select: {
    defaultProps: {
      size: "md",
      radius: "md",
    },
    styles: (theme: MantineTheme) => ({
      input: {
        "&:focus": {
          borderColor: theme.colors.primary[5],
        },
      },
    }),
  },

  Card: {
    defaultProps: {
      radius: "lg",
      withBorder: true,
    },
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.white,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows.md,
        },
      },
    }),
  },

  Modal: {
    defaultProps: {
      radius: "lg",
      padding: "xl",
    },
    styles: (theme: MantineTheme) => ({
      modal: {
        backgroundColor: theme.white,
      },
      header: {
        marginBottom: theme.spacing.md,
      },
    }),
  },

  Navbar: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.white,
        borderRight: `1px solid ${theme.colors.gray[2]}`,
      },
    }),
  },

  Header: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.white,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
      },
    }),
  },

  Footer: {
    styles: (theme: MantineTheme) => ({
      root: {
        backgroundColor: theme.white,
        borderTop: `1px solid ${theme.colors.gray[2]}`,
      },
    }),
  },

  Table: {
    styles: (theme: MantineTheme) => ({
      root: {
        "& th": {
          backgroundColor: theme.colors.gray[0],
          fontWeight: 600,
        },
        "& tr:hover": {
          backgroundColor: theme.colors.gray[0],
        },
      },
    }),
  },

  Badge: {
    defaultProps: {
      radius: "xl",
    },
  },

  Alert: {
    defaultProps: {
      radius: "md",
    },
  },

  Tooltip: {
    defaultProps: {
      radius: "md",
    },
  },

  Popover: {
    defaultProps: {
      radius: "md",
    },
  },

  Menu: {
    defaultProps: {
      radius: "md",
    },
  },

  Dropdown: {
    defaultProps: {
      radius: "md",
    },
  },
};
