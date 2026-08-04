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

	/* Contact form: composes an email in the visitor's mail client.
	   No backend needed; the "How did you hear about us?" answer rides along. */
	const form = document.getElementById("contact-form");
	if (form) {
		form.addEventListener("submit", (e) => {
			e.preventDefault();
			const v = (name) => (form.elements[name] ? form.elements[name].value.trim() : "");
			const subject = `Website inquiry from ${v("name")}`;
			const body = [
				`Name: ${v("name")}`,
				`Email: ${v("email")}`,
				`Business: ${v("business")}`,
				`How did you hear about us: ${v("source")}`,
				"",
				v("message"),
			].join("\n");
			window.location.href =
				"mailto:tymurbondar@outlook.com?subject=" +
				encodeURIComponent(subject) +
				"&body=" +
				encodeURIComponent(body);
		});
	}

	/* Copyright year */
	const year = document.getElementById("year");
	if (year) year.textContent = String(new Date().getFullYear());
})();
