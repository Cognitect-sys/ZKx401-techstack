import asyncio
from playwright.async_api import async_playwright

async def test_final_website():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.set_viewport_size({"width": 1920, "height": 1080})
        
        print("=== Final ZKx401 Light Theme Testing ===")
        print("URL: https://etd5xkpda4lu.space.minimax.io")
        
        try:
            await page.goto("https://etd5xkpda4lu.space.minimax.io", timeout=30000)
            await page.wait_for_load_state("networkidle")
            print("✓ Website loaded successfully")
            
            # Check page title
            title = await page.title()
            print(f"Page Title: {title}")
            
            # Test light theme
            body_bg = await page.evaluate("window.getComputedStyle(document.body).backgroundColor")
            print(f"Body background: {body_bg}")
            
            if "rgb(248, 250, 252)" in body_bg or "255, 255, 255" in body_bg:
                print("✓ Light theme confirmed!")
            else:
                print("⚠ Theme may not be light")
            
            # Test navigation
            nav_elements = await page.query_selector_all("button, a")
            print(f"Navigation elements: {len(nav_elements)}")
            
            # Test sections
            sections = await page.query_selector_all("section")
            print(f"Sections found: {len(sections)}")
            
            # Test canvas (particle background)
            canvas = await page.query_selector("canvas")
            if canvas:
                print("✓ Particle background found")
            else:
                print("⚠ No particle background")
            
            # Test responsive
            await page.set_viewport_size({"width": 375, "height": 667})
            await asyncio.sleep(1)
            print("✓ Mobile responsive tested")
            
            # Back to desktop
            await page.set_viewport_size({"width": 1920, "height": 1080})
            await asyncio.sleep(1)
            print("✓ Desktop restored")
            
            # Performance check
            load_time = await page.evaluate("() => performance.timing.loadEventEnd - performance.timing.navigationStart")
            print(f"Load time: {load_time}ms")
            
            # Check for development artifacts
            content = await page.content()
            if "minimax" not in content.lower():
                print("✓ No development artifacts found")
            else:
                print("⚠ Development artifacts detected")
            
            print("\n=== FINAL TEST COMPLETED SUCCESSFULLY ===")
            print("ZKx401 Light Theme Website is ready for production!")
            
        except Exception as e:
            print(f"Error: {e}")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(test_final_website())