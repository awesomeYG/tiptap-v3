import { addOpacityToColor } from '../util';
import { custom, type ThemeColor } from './color';
export default function componentStyleOverrides(color: ThemeColor) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
          overflow: 'hidden',
          minHeight: '36px',
          height: '36px',
          padding: '0px !important',
        },
        indicator: {
          borderRadius: '0px !important',
          overflow: 'hidden',
          backgroundColor: '#21222D !important',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '0px !important',
          fontWeight: 'normal',
          fontSize: '14px !important',
          lineHeight: '34px',
          padding: '0 16px !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        root: ({ ownerState }: { ownerState: any }) => {
          return {
            height: '36px',
            fontSize: 14,
            lineHeight: '36px',
            paddingLeft: '16px',
            paddingRight: '16px',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            borderRadius: '10px',
            fontWeight: '400',
            ...(ownerState.variant === 'contained' && {
              color: color.text.inverse,
              backgroundColor: color.text.primary,
            }),
            ...(ownerState.variant === 'text' && {}),
            ...(ownerState.variant === 'outlined' && {
              color: color.text.primary,
              border: `1px solid ${color.text.primary}`,
            }),
            ...(ownerState.disabled === true && {
              cursor: 'not-allowed !important',
            }),
            ...(ownerState.size === 'small' && {
              height: '32px',
              lineHeight: '32px',
            }),
            '&:hover': {
              boxShadow: 'none',
              ...(ownerState.variant === 'contained' && {
                backgroundColor: addOpacityToColor(color.text.primary, 0.9),
              }),
              ...(ownerState.variant === 'text' && {
                backgroundColor: color.background.paper3,
              }),
              ...(ownerState.variant === 'outlined' && {
                backgroundColor: color.background.paper3,
              }),
              ...(ownerState.color === 'neutral' && {
                color: color.text.primary,
              }),
            },
          };
        },
        startIcon: {
          marginLeft: 0,
          marginRight: 8,
          '>*:nth-of-type(1)': {
            fontSize: 14,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: '10px',
          maxWidth: '600px',
          padding: '8px 16px',
          backgroundColor: color.text.primary,
          fontSize: '12px',
          lineHeight: '20px',
          color: color.primary.contrastText,
        },
        arrow: {
          color: color.text.primary,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: color.error.main,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '.MuiFormLabel-asterisk': {
            color: color.error.main,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: '0 !important',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '.MuiTableRow-root:hover': {
            '.MuiTableCell-root:not(.cx-table-empty-td)': {
              backgroundColor: color.table.row.hoverColor,
              overflowX: 'hidden',
              '.primary-color': {
                color: color.primary.main,
              },
              '.no-title-url': {
                color: `${color.primary.main} !important`,
              },
              '.error-color': {
                opacity: 1,
              },
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          svg: {
            fontSize: '18px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          background: color.background.paper,
          lineHeight: 1.5,
          fontSize: '14px',
          paddingTop: '16px !important',
          paddingBottom: '16px !important',
          paddingLeft: 0,
          '&:first-of-type': {
            paddingLeft: '0px',
          },
          '&:not(:first-of-type)': {
            paddingLeft: '0px',
          },
          '.MuiCheckbox-root': {
            color: '#CCCCCC',
            svg: {
              fontSize: '16px',
            },
            '&.Mui-checked': {
              color: color.text.primary,
            },
          },
        },
        head: {
          backgroundColor: color.background.paper3,
          color: color.table.head.color,
          fontSize: '12px',
          paddingTop: '0 !important',
          paddingBottom: '0 !important',
          borderSpacing: '12px',
          zIndex: 100,
        },
        body: {
          borderBottom: '1px dashed',
          borderColor: color.table.cell.borderColor,
          borderSpacing: '12px',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: '10px',
          boxShadow: custom.selectPopupBoxShadow,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          padding: '4px',
          borderRadius: '10px',
          backgroundColor: color.background.paper,
          boxShadow: custom.selectPopupBoxShadow,
        },
        list: {
          paddingTop: '0px !important',
          paddingBottom: '0px !important',
        },
      },
      defaultProps: {
        elevation: 0,
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          height: '40px',
          borderRadius: '5px',
          ':hover': {
            backgroundColor: color.background.paper3,
          },
          '&.Mui-selected': {
            fontWeight: '500',
            backgroundColor: `${custom.selectedMenuItemBgColor} !important`,
            color: color.primary.main,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: ({ ownerState }: { ownerState: { elevation?: number } }) => {
          return {
            ...(ownerState.elevation === 0 && {
              backgroundColor: color.background.paper2,
            }),
            ...(ownerState.elevation === 2 && {
              backgroundColor: color.background.paper3,
            }),
            backgroundImage: 'none',
          };
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 1,
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          'h2.MuiTypography-root button': {
            marginRight: '2px',
          },
          '.MuiDialogActions-root': {
            paddingTop: '24px',
            button: {
              width: '88px',
              height: '36px !important',
            },
            '.MuiButton-text': {
              width: 'auto',
              minWidth: 'auto',
              color: `${color.text.primary} !important`,
            },
          },
        },
        container: {
          height: '100vh',
          bgcolor: color.text.secondary,
          backdropFilter: 'blur(5px)',
        },
        paper: {
          pb: 1,
          border: '1px solid',
          borderColor: color.divider,
          borderRadius: '10px',
          backgroundColor: color.background.paper,
          textarea: {
            borderRadius: '8px 8px 0 8px',
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          paddingTop: '24px',
          '> button': {
            top: '20px',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          lineHeight: '22px',
          paddingTop: '1px',
          paddingBottom: '1px',
          borderRadius: '10px',
          boxShadow: 'none',
        },
        icon: {
          padding: '10px 0',
        },
        standardInfo: {
          backgroundColor: addOpacityToColor(color.primary.main, 0.1),
          color: color.text.primary,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 0,
          paddingRight: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          label: {
            color: color.text.secondary,
          },
          'label.Mui-focused': {
            color: color.text.primary,
          },
          '& .MuiInputBase-input::placeholder': {
            fontSize: '12px',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '10px !important',
          backgroundColor: color.background.paper3,
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: `${color.background.paper3} !important`,
            borderWidth: '1px !important',
          },
          '&.Mui-focused': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: `${color.text.primary} !important`,
              borderWidth: '1px !important',
            },
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: `${color.text.primary} !important`,
              borderWidth: '1px !important',
            },
          },
          input: {
            height: '19px',
            '&.Mui-disabled': {
              color: `${color.text.secondary} !important`,
              WebkitTextFillColor: `${color.text.secondary} !important`,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          height: '36px',
          borderRadius: '10px !important',
          backgroundColor: color.background.paper3,
        },
        select: {
          paddingRight: '0 !important',
        },
      },
    },
  };
}
