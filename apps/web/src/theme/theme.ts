"use client";

import { Container, createTheme, rem } from "@mantine/core";
import cx from "clsx";
import classes from "./container.module.css";

export const theme = createTheme({

  defaultRadius: "xs",

  fontFamily: "Inter, sans-serif",

  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ [classes.responsiveContainer]: size === "responsive" }),
      }),
      defaultProps: { size: "responsive" },
    }),

     Anchor: {
      styles: (theme :any) => ({
        root: {

          textUnderlineOffset: rem(3),
          transition: "0.15s ease",

          "&:hover": {
            textDecoration: "underline",
          },


        },
      }),
    },

  },

});