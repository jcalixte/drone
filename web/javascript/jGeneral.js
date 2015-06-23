$(function() {
	// Changement des options par défaut des notifications
	toastr.options.positionClass = "toast-bottom-right";
	toastr.options.closeButton = true;
	toastr.options.progressBar = true;

	var tl = new TimelineMax({
		repeat: -1
	});

	tl.set('#outline', {
		drawSVG: '0% 0%'
	})
	.to('#outline', 0.2, {
		drawSVG: '11% 25%',
		ease: Linear.easeNone
	})
	.to('#outline', 0.5, {
		drawSVG: '35% 70%',
		ease: Linear.easeNone
	})
	.to('#outline', 0.9, {
		drawSVG: '99% 100%',
		ease: Linear.easeNone
	});
});