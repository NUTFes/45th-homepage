"use client";

import type { ReactNode } from "react";
import { ChevronUp } from "lucide-react";
import {
	Button,
	Disclosure,
	DisclosureGroup,
	DisclosurePanel,
	Heading,
	type DisclosureGroupProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

export type MapAccordionItem = {
	id: string;
	title: string;
	content: ReactNode;
};

export type MapAccordionProps = Omit<DisclosureGroupProps, "children"> & {
	items: MapAccordionItem[];
};

const itemClassName = "bg-base border-y border-secondary";
const triggerClassName =
	"group flex w-full items-center justify-between gap-s px-3l py-m text-left";
const titleClassName = "text-title-small text-font-main";
const chevronClassName =
	"h-[10px] w-[20px] text-font-main transition-transform duration-300 group-data-expanded:rotate-180";
const panelClassName =
	"h-(--disclosure-panel-height) overflow-hidden duration-300 motion-safe:transition-[height] [hidden]:block";
const panelInnerClassName = "px-3l pb-m text-text text-font-main";

export default function MapAccordion({ items, className, ...props }: MapAccordionProps) {
	return (
		<DisclosureGroup
			{...props}
			allowsMultipleExpanded
			aria-label="マップアコーディオン"
			className={twMerge("flex w-full flex-col", className)}
		>
			{items.map((item) => (
				<Disclosure key={item.id} className={itemClassName}>
					<Heading className="m-0">
						<Button slot="trigger" className={triggerClassName}>
							<span className={titleClassName}>{item.title}</span>
							<ChevronUp aria-hidden className={chevronClassName} />
						</Button>
					</Heading>
					<DisclosurePanel className={panelClassName}>
						<div className={panelInnerClassName}>{item.content}</div>
					</DisclosurePanel>
				</Disclosure>
			))}
		</DisclosureGroup>
	);
}
