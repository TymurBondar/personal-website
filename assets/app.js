/* TYMURBONDAR.COM — mechanical interactions, zero dependencies. */
(() => {
	"use strict";

	/* Mobile drawer */
	const burger = document.getElementById("burger");
	const drawer = document.getElementById("drawer");
	if (burger && drawer) {
		const close = () => {
			document.body.classList.remove("menu-open");
			burger.setAttribute("aria-expanded", "false");
			burger.setAttribute("aria-label", "Open menu");
		};
		burger.addEventListener("click", () => {
			const open = document.body.classList.toggle("menu-open");
			burger.setAttribute("aria-expanded", String(open));
			burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
		});
		drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") close();
		});
	}

	/* Reveal on scroll */
	const revealed = document.querySelectorAll("[data-reveal]");
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (revealed.length && "IntersectionObserver" in window && !reduced) {
		const io = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-in");
						io.unobserve(entry.target);
					}
				});
			},
			{ rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
		);
		revealed.forEach((el) => io.observe(el));
	} else {
		revealed.forEach((el) => el.classList.add("is-in"));
	}

	/* Copyright year */
	const year = document.getElementById("year");
	if (year) year.textContent = String(new Date().getFullYear());
})();
