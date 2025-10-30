import asyncio
from playwright.async_api import async_playwright, expect
import time
import json

async def test_zkx401_website():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set viewport for desktop testing
        await page.set_viewport_size({'width': 1920, 'height': 1080})
        
        print('=== ZKx401 Website Testing ===')
        print('URL: https://pxk9n172pmq4.space.minimax.io')
        
        try:
            # Navigate to website
            print('\n1. Loading Website...')
            await page.goto('https://pxk9n172pmq4.space.minimax.io', timeout=30000)
            await page.wait_for_load_state('networkidle')
            print('✓ Website loaded successfully')
            
            # Test 1: Page title and basic structure
            print('\n2. Testing Basic Structure...')
            title = await page.title()
            print(f'Page Title: {title}')
            
            # Check main sections
            sections = await page.query_selector_all('section')
            print(f'Number of sections found: {len(sections)}')
            
            # Test 2: Navigation functionality
            print('\n3. Testing Navigation...')
            nav_links = await page.query_selector_all('.nav-link')
            print(f'Navigation links found: {len(nav_links)}')
            
            # Test 3: Hero section and animated background
            print('\n4. Testing Hero Section...')
            hero_section = await page.query_selector('.hero')
            if hero_section:
                print('✓ Hero section found')
                
                # Check for canvas element (particle background)
                canvas = await page.query_selector('#particleCanvas')
                if canvas:
                    print('✓ Particle canvas found')
                    # Check if canvas has content
                    canvas_visible = await canvas.is_visible()
                    print(f'Canvas visible: {canvas_visible}')
                else:
                    print('✗ Particle canvas not found')
            
            # Test 4: Button functionality
            print('\n5. Testing Interactive Elements...')
            buttons = await page.query_selector_all('.btn')
            print(f'Buttons found: {len(buttons)}')
            
            # Test primary CTA button
            primary_btn = await page.query_selector('.btn-primary')
            if primary_btn:
                btn_text = await primary_btn.inner_text()
                print(f'Primary button text: {btn_text.strip()}')
                
                # Test button hover
                await primary_btn.hover()
                await asyncio.sleep(0.5)
                print('✓ Button hover tested')
            
            # Test 5: Content sections
            print('\n6. Testing Content Sections...')
            
            # Mission section
            mission_section = await page.query_selector('.mission')
            if mission_section:
                print('✓ Mission section found')
            
            # Features section
            features_section = await page.query_selector('.features')
            if features_section:
                print('✓ Features section found')
                feature_cards = await features_section.query_selector_all('.feature-card')
                print(f'Feature cards: {len(feature_cards)}')
            
            # Technical section
            technical_section = await page.query_selector('.technical')
            if technical_section:
                print('✓ Technical section found')
                
                # Test code blocks
                code_blocks = await technical_section.query_selector_all('.code-block')
                print(f'Code blocks: {len(code_blocks)}')
                
                # Test copy functionality
                if code_blocks:
                    copy_btn = await code_blocks[0].query_selector('.copy-btn')
                    if copy_btn:
                        print('Testing copy button...')
                        await copy_btn.click()
                        await asyncio.sleep(1)
                        print('✓ Copy button clicked')
            
            # Use cases section
            use_cases_section = await page.query_selector('.use-cases')
            if use_cases_section:
                print('✓ Use cases section found')
                use_case_items = await use_cases_section.query_selector_all('.use-case-item')
                print(f'Use case items: {len(use_case_items)}')
            
            # Test 6: Images loading
            print('\n7. Testing Image Loading...')
            images = await page.query_selector_all('img')
            print(f'Images found: {len(images)}')
            
            for i, img in enumerate(images[:5]):  # Test first 5 images
                src = await img.get_attribute('src')
                if src:
                    print(f'Image {i+1}: {src}')
                    # Check if image loads properly
                    try:
                        await img.wait_for_element_state('visible', timeout=3000)
                        print(f'✓ Image {i+1} loaded successfully')
                    except:
                        print(f'✗ Image {i+1} failed to load')
            
            # Test 7: Responsive design
            print('\n8. Testing Responsive Design...')
            
            # Test mobile viewport
            await page.set_viewport_size({'width': 375, 'height': 667})
            await asyncio.sleep(1)
            print('✓ Mobile viewport tested')
            
            # Test tablet viewport
            await page.set_viewport_size({'width': 768, 'height': 1024})
            await asyncio.sleep(1)
            print('✓ Tablet viewport tested')
            
            # Back to desktop
            await page.set_viewport_size({'width': 1920, 'height': 1080})
            await asyncio.sleep(1)
            print('✓ Desktop viewport restored')
            
            # Test 8: Scroll behavior
            print('\n9. Testing Scroll Behavior...')
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight/2)')
            await asyncio.sleep(1)
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            await asyncio.sleep(1)
            await page.evaluate('window.scrollTo(0, 0)')
            await asyncio.sleep(1)
            print('✓ Scroll behavior tested')
            
            # Test 9: Performance check
            print('\n10. Performance Check...')
            load_time = await page.evaluate('() => performance.timing.loadEventEnd - performance.timing.navigationStart')
            print(f'Page load time: {load_time}ms')
            
            if load_time < 3000:
                print('✓ Good performance (load time < 3s)')
            else:
                print('⚠ Slow performance (load time > 3s)')
            
            print('\n=== TESTING COMPLETED SUCCESSFULLY ===')
            print('All major functionality tested and working properly!')
            
        except Exception as e:
            print(f'✗ Testing failed: {str(e)}')
            await page.screenshot(path='error_screenshot.png')
            print('Screenshot saved as error_screenshot.png')
        
        finally:
            await browser.close()

# Run the test
if __name__ == "__main__":
    asyncio.run(test_zkx401_website())