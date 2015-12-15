//
//  ImageEditor.m
//  reactnativecreativeadobesdk
//
//  Created by Gerald Olivero on 09/12/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import "ImageEditor.h"
#import "RCTBridgeModule.h"
#import <AdobeCreativeSDKCore/AdobeCreativeSDKCore.h>
#import <AdobeCreativeSDKImage/AdobeCreativeSDKImage.h>
#import "RCTLog.h"


@interface ImageEditor ()
@property (nonatomic, strong) NSDictionary *defaultOptions;
@property (nonatomic, retain) NSMutableDictionary *options;
@property (nonatomic, strong) RCTResponseSenderBlock callback;
@property (nonatomic, strong) AdobeUXImageEditorViewController *editorController;
@end


@implementation ImageEditor

RCT_EXPORT_MODULE();

- (instancetype)init
{
  
  [[AdobeUXAuthManager sharedManager] setAuthenticationParametersWithClientID:@"25280143c78e49db9bdb18c12da6dfe0" clientSecret:@"a87b8180-094d-49f1-9bb0-fa561a079979" enableSignUp:true];
  
  NSLog(@"====I started====\n");
  if (self = [super init]) {
    self.defaultOptions = @{
                            @"image": @"",
                            @"clientid": @"",
                            @"secretkey": @""
                            };
  }
  
  return self;
}


RCT_EXPORT_METHOD(showEditor:(NSDictionary *)params callback:(RCTResponseSenderBlock)callback) {
  
  [AdobeImageEditorOpenGLManager beginOpenGLLoad];
  
  self.callback = callback;
  self.options = [NSMutableDictionary dictionaryWithDictionary:self.defaultOptions];
  
  
  
  for (NSString *key in params.keyEnumerator) { // Replace default options
    [self.options setValue:params[key] forKey:key];
  }
  
  NSString *imgURL = [self.options objectForKey:@"image"];
  
  [self launchPhotoEditorWithImage: [UIImage imageWithContentsOfFile:imgURL] ];
  
}


- (void)launchPhotoEditorWithImage:(UIImage*)source {
  self.editorController = [[AdobeUXImageEditorViewController alloc] initWithImage:source];
  self.editorController.delegate = self;
  
  [AdobeImageEditorCustomization setToolOrder:@[kAdobeImageEditorCrop, kAdobeImageEditorColorAdjust,kAdobeImageEditorBlemish, kAdobeImageEditorEnhance]];
  [AdobeImageEditorCustomization setCropToolCustomEnabled:NO];
  [AdobeImageEditorCustomization setCropToolInvertEnabled:NO];
  [AdobeImageEditorCustomization setCropToolOriginalEnabled:NO];
  
  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  dispatch_async(dispatch_get_main_queue(), ^{
    [root presentViewController:self.editorController animated:YES completion:nil];
  });
}


- (void)photoEditor:(AdobeUXImageEditorViewController *)editor finishedWithImage:(UIImage *)image
{
  // Handle the result image here
  NSLog(@"\nIk the editor closing");
  RCTLogInfo(@"DONE EDITING");
  
  /* creating a temp url to be passed */
  NSString *ImageUUID = [[NSUUID UUID] UUIDString];
  NSString *ImageName = [ImageUUID stringByAppendingString:@".jpg"];
  // This will be the default URL
  NSString* path = [[NSTemporaryDirectory()stringByStandardizingPath] stringByAppendingPathComponent:ImageName];
  
  NSMutableDictionary *response = [[NSMutableDictionary alloc] init];
  
  NSData *data = UIImageJPEGRepresentation(image, [[self.options valueForKey:@"quality"] floatValue]);
  // file uri
  NSString *dataString = [data base64EncodedStringWithOptions:0];
  [response setObject:dataString forKey:@"data"];
  
  [data writeToFile:path atomically:YES];
  NSString *fileURL = [[NSURL fileURLWithPath:path] absoluteString];
  [response setObject:fileURL forKey:@"uri"];
  
  self.callback(@[@NO, response]);
  [editor dismissViewControllerAnimated:YES completion:nil];
}

- (void)photoEditorCanceled:(AdobeUXImageEditorViewController *)editor
{
  // Dismiss the editor.
  self.callback(@[@YES, [NSNull null]]);
  [editor dismissViewControllerAnimated:YES completion:nil];
}





@end
