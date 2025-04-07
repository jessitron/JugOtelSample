#!/bin/bash

# Create assets directory if it doesn't exist
mkdir -p services/ecommerce_api/src/assets/images

# Download product images
curl -o services/ecommerce_api/src/assets/images/headphones.jpg https://images.unsplash.com/photo-1505740420928-5e560c06d30e
curl -o services/ecommerce_api/src/assets/images/smartwatch.jpg https://images.unsplash.com/photo-1523275335684-37898b6baf30
curl -o services/ecommerce_api/src/assets/images/backpack.jpg https://images.unsplash.com/photo-1553062407-98eeb64c6a62
curl -o services/ecommerce_api/src/assets/images/mouse.jpg https://images.unsplash.com/photo-1527814050087-3793815479db
curl -o services/ecommerce_api/src/assets/images/keyboard.jpg https://images.unsplash.com/photo-1587829741301-dc798b83add3
curl -o services/ecommerce_api/src/assets/images/mousepad.jpg https://images.unsplash.com/photo-1592155931584-901ac15763e3
curl -o services/ecommerce_api/src/assets/images/usbhub.jpg https://images.unsplash.com/photo-1593642632823-8f785ba67e45
curl -o services/ecommerce_api/src/assets/images/speaker.jpg https://images.unsplash.com/photo-1606220588911-5117e479d3a1
curl -o services/ecommerce_api/src/assets/images/laptopstand.jpg https://images.unsplash.com/photo-1517336714731-489689fd1ca8
curl -o services/ecommerce_api/src/assets/images/webcam.jpg https://images.unsplash.com/photo-1516035069371-29a1b244cc32

echo "Product images downloaded successfully!" 