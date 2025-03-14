const waitForElement = (selector, callback) => {
    const observer = new MutationObserver((mutationsList, observer) => {
        if (document.querySelector(selector)) {
            observer.disconnect();
            callback(document.querySelector(selector));
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

(function () {
    if (window.location.href.includes('/videos')) {
        const regex = /content="(vnd\.youtube:\/\/www\.youtube\.com\/channel\/([A-Za-z0-9_-]+))"/i;
        const html = document.documentElement.innerHTML;
        const nvdUrl = html.match(regex);
        const lastVideoElement = 'ytd-rich-item-renderer a#thumbnail'

        waitForElement(lastVideoElement, (element) => {
            if (nvdUrl && element) {
                const buttonContainer = document.querySelector('#chips');
                if (buttonContainer) {
                    const link = document.createElement("a");
                    link.href = `${element.href}&list=UU${nvdUrl[2].slice(2)}`;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.style = 'display: inline-block; vertical-align: middle;';

                    const img = document.createElement("img");
                    img.src = chrome.runtime.getURL('icon.png');
                    img.style.height = "24px";
                    img.style.width = "24px";
                    img.style.marginLeft = "10px";
                    img.style.cursor = "pointer";

                    link.appendChild(img);
                    buttonContainer.appendChild(link);
                } else {
                    console.log("❌ buttonContainer #chips not found", { buttonContainer: buttonContainer });
                }
            } else {
                console.log("❌ nvdUrl or lastVideoElement not found", { nvdUrl: nvdUrl, lastVideoElement: lastVideoElement });
            }
        })
    }
})();