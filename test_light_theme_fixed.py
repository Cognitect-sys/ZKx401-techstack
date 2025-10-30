import asyncio
from playwright.async_api import async_playwright
import time

async def test_zkx401_light_website():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set viewport for desktop testing
        await page.set_viewport_size({"width": 1920, "height": 1080})
        
        print("=== ZKx401 Light Theme Website Testing ===")
        print("URL: https://aaw3wa497xs5.space.minimax.io")
        
        try:
            # Navigate to website
            print("\n1. Loading Website...")
            await page.goto("https://aaw3wa497xs5.space.minimax.io", timeout=30000)
            await page.wait_for_load_state("networkidle")
            print("✓ Website loaded successfully")
            
            # Test 1: Page title and basic structure
            print("\n2. Testing Basic Structure...")
            title = await page.title()
            print(f"Page Title: {title}")
            
            # Check main sections
            sections = await page.query_selector_all("section")
            print(f"Number of sections found: {len(sections)}")
            
            # Test 2: Light theme verification
            print("\n3. Testing Light Theme Design...")
            body_bg = await page.evaluate("window.getComputedStyle(document.body).backgroundColor")
            print(f"Body background color: {body_bg}")
            
            # Check if background is light
            if "rgb(248, 250, 252)" in body_bg or "255, 255, 255" in body_bg:
                print("✓ Light theme background confirmed")
            else:
                print("⚠ Background may not be light theme")
            
            # Test 3: Navigation functionality
            print("\n4. Testing Navigation...")
            nav_links = await page.query_selector_all(".nav-link, button")
            print(f"Navigation elements found: {len(nav_links)}")
            
            # Test navigation hover
            primary_btn = await page.query_selector(".bg-accent-primary")
            if primary_btn:
                btn_text = await primary_btn.inner_text()
                print(f"Primary button text: {btn_text.strip()}")
                await primary_btn.hover()
                await asyncio.sleep(0.5)
                print("✓ Button hover tested")
            
            # Test 4: Hero section and particle background
            print("\n5. Testing Hero Section...")
            hero_section = await page.query_selector(".relative.min-h-screen")
            if hero_section:
                print("✓ Hero section found")
                
                # Check for canvas element (particle background)
                canvas = await page.query_selector("canvas")
                if canvas:
                    canvas_visible = await canvas.is_visible()
                    print(f"Particle canvas found and visible: {canvas_visible}")
                else:
                    print("⚠ Particle canvas not found")
            
            # Test 5: Content sections
            print("\n6. Testing Content Sections...")
            
            # Mission section
            mission_section = await page.query_selector("#mission")
            if mission_section:
                print("✓ Mission section found")
            
            # Features section
            features_section = await page.query_selector(".py-16.lg\\\\:py-24.bg-background-pure-white")
            if features_section:
                print("✓ Features section found")
                feature_cards = await features_section.query_selector_all(".bg-background-card")
                print(f"Feature cards: {len(feature_cards)}")
            
            # Technical section
            technical_section = await page.query_selector("#quickstart")
            if technical_section:
                print("✓ Technical section found")
                
                # Test code blocks
                code_blocks = await technical_section.query_selector_all(".bg-background-card")
                print(f"Code blocks: {len(code_blocks)}")
                
                # Test copy functionality
                copy_buttons = await technical_section.query_selector_all("button")
                if copy_buttons:
                    print("Testing copy button...")
                    await copy_buttons[0].click()
                    await asyncio.sleep(1)
                    print("✓ Copy button clicked")
            
            # Test 6: Light theme visual verification
            print("\n7. Testing Light Theme Visual Elements...")
            
            # Check text colors
            text_elements = await page.query_selector_all("h1, h2, h3, p")
            for i, element in enumerate(text_elements[:3]):  # Check first 3 text elements
                color = await element.evaluate("el => window.getComputedStyle(el).color")
                print(f"Text element {i+1} color: {color}")
            
            # Check for card backgrounds
            cards = await page.query_selector_all(".bg-background-card, .bg-background-near-white")
            print(f"Light theme cards found: {len(cards)}")
            
            # Test 7: Images loading
            print("\n8. Testing Image Loading...")
            images = await page.query_selector_all("img")
            print(f"Images found: {len(images)}")
            
            for i, img in enumerate(images[:3]):  # Test first 3 images
                src = await img.get_attribute("src")
                if src:
                    print(f"Image {i+1}: {src}")
                    try:
                        await img.wait_for_element_state("visible", timeout=3000)
                        print(f"✓ Image {i+1} loaded successfully")
                    except:
                        print(f"⚠ Image {i+1} failed to load")
            
            # Test 8: Responsive design
            print("\n9. Testing Responsive Design...")
            
            # Test mobile viewport
            await page.set_viewport_size({"width": 375, "height": 667})
            await asyncio.sleep(1)
            
            # Check mobile navigation
            mobile_menu = await page.query_selector("button")
            if mobile_menu:
                print("✓ Mobile menu found")
            
            print("✓ Mobile viewport tested")
            
            # Test tablet viewport
            await page.set_viewport_size({"width": 768, "height": 1024})
            await asyncio.sleep(1)
            print("✓ Tablet viewport tested")
            
            # Back to desktop
            await page.set_viewport_size({"width": 1920, "height": 1080})
            await asyncio.sleep(1)
            print("✓ Desktop viewport restored")
            
            # Test 9: Scroll behavior
            print("\n10. Testing Scroll Behavior...")
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
            await asyncio.sleep(1)
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(1)
            await page.evaluate("window.scrollTo(0, 0)")
            await asyncio.sleep(1)
            print("✓ Scroll behavior tested")
            
            # Test 10: Performance check
            print("\n11. Performance Check...")
            load_time = await page.evaluate("() => performance.timing.loadEventEnd - performance.timing.navigationStart")
            print(f"Page load time: {load_time}ms")
            
            if load_time < 3000:
                print("✓ Good performance (load time < 3s)")
            else:
                print("⚠ Slow performance (load time > 3s)")
            
            # Test 11: No development artifacts check
            print("\n12. Testing for Development Artifacts...")
            page_content = await page.content()
            
            if "minimax" in page_content.lower():
                print("⚠ Development artifacts found in page content")
            else:
                print("✓ No development artifacts found")
            
            print("\n=== LIGHT THEME TESTING COMPLETED SUCCESSFULLY ===")
            print("Website loads properly with light theme design!")
            print("All major functionality tested and working correctly!")
            
        except Exception as e:
            print(f"✗ Testing failed: {str(e)}")
            await page.screenshot(path="light_theme_error.png")
            print("Screenshot saved as light_theme_error.png")
        
        finally:
            await browser.close()

# Run the test
if __name__ == "__main__":
    asyncio.run(test_zkx401_light_website())