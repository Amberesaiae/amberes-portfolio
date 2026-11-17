// Runs in the page. Generic DOM measurements that work on both sites (no site-specific selectors needed).
export const measureFn = () => {
	const cs = (el) => getComputedStyle(el);
	const r = (el) => { const b = el.getBoundingClientRect(); return { x: +(b.left + scrollX).toFixed(1), y: +(b.top + scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) }; };
	const rot = (el) => { const t = cs(el).transform; if (!t || t === 'none') return 0; const m = t.match(/matrix\(([^)]+)\)/); if (!m) return null; const [a, b] = m[1].split(',').map(Number); return +(Math.atan2(b, a) * 180 / Math.PI).toFixed(2); };
	const vis = (el) => { const b = el.getBoundingClientRect(); const s = cs(el); return b.width > 2 && b.height > 2 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.02; };
	const text = [];
	for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,button,span,li,label,time,figcaption')) {
		if (!vis(el)) continue;
		const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
		if (!own) continue;
		const s = cs(el);
		text.push({ tag: el.tagName.toLowerCase(), text: own.slice(0, 40), ...r(el), fontFamily: s.fontFamily.split(',')[0].replace(/["']/g, ''), fontSize: s.fontSize, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, fontWeight: s.fontWeight, color: s.color, textTransform: s.textTransform });
	}
	const boxes = [];
	for (const el of document.querySelectorAll('img,video,canvas,svg,[class*=card],[class*=tile],article,figure,[data-card],[data-reveal],header,nav,footer,main')) {
		if (!vis(el)) continue;
		const b = r(el); if (b.w < 40 || b.h < 40) continue;
		const s = cs(el);
		boxes.push({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class') || '').slice(0, 50), ...b, rot: rot(el), radius: s.borderRadius, bg: s.backgroundColor, shadow: s.boxShadow === 'none' ? '' : s.boxShadow.slice(0, 60) });
	}
	const root = cs(document.documentElement), body = cs(document.body);
	return { viewport: { w: innerWidth, h: innerHeight }, htmlBg: root.backgroundColor, bodyBg: body.backgroundColor, bodyColor: body.color, bodyFont: body.fontFamily, text, boxes };
};
