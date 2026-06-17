"use client";

import { useState } from "react";
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";

export type HeaderDropdownItem = {
  label: string;
  href: string;
  disabled?: boolean;
};

type HeaderDropdownProps = {
  disabled?: boolean;
  label: string;
  items: HeaderDropdownItem[];
};

export default function HeaderDropdown({ disabled = false, label, items }: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen} trigger="press">
      <Button
        className={`inline-flex rounded-sm py-s transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-main disabled:cursor-not-allowed disabled:text-font-gray ${
          isOpen
            ? "text-base underline underline-offset-4"
            : "text-base-dark hover:text-base hover:underline hover:underline-offset-4"
        }`}
        isDisabled={disabled}
      >
        {label}
      </Button>

      <Popover
        className="entering:duration-300 entering:ease-in-out entering:animate-in entering:fade-in entering:slide-in-from-top-2 exiting:duration-200 exiting:ease-in-out exiting:animate-out exiting:fade-out exiting:slide-out-to-top-2 z-250 w-[206px] overflow-hidden rounded-lg bg-white shadow-[0_0_12px_0] shadow-base-shadow/50 outline-none"
        offset={0}
        placement="bottom"
      >
        <Menu aria-label={label} className="py-0 outline-none">
          {items.map((item) => (
            <MenuItem
              key={item.label}
              href={item.href}
              isDisabled={item.disabled}
              textValue={item.label}
              className="block cursor-pointer px-[40px] py-s text-left text-text-large text-base-dark transition-colors duration-200 outline-none hover:bg-base-dark hover:text-font-main focus-visible:bg-base-dark focus-visible:text-font-main disabled:cursor-not-allowed disabled:text-font-gray disabled:hover:bg-transparent disabled:hover:text-font-gray"
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
