package cn.toside.music.mobile.scanner;

import android.Manifest;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Log;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

/**
 * 通过 MediaStore 扫描设备上的本地音乐，返回文件路径与基础元数据。
 * 生成的 musicInfo 仍走 LX 原有的 readMetadata 流程，这里只负责「找出有哪些歌」。
 */
public class MusicScannerModule extends ReactContextBaseJavaModule {
  private static final String TAG = "MusicScanner";
  /** 过滤掉小于 30 秒的音频（提示音、录音等） */
  private static final long MIN_DURATION = 30 * 1000L;

  private final ReactApplicationContext reactContext;

  MusicScannerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "MusicScanner";
  }

  /** Android 13（API 33）起读取音频需要 READ_MEDIA_AUDIO */
  private String getAudioPermission() {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
      ? "android.permission.READ_MEDIA_AUDIO"
      : Manifest.permission.READ_EXTERNAL_STORAGE;
  }

  @ReactMethod
  public void hasPermission(Promise promise) {
    try {
      promise.resolve(ContextCompat.checkSelfPermission(reactContext, getAudioPermission())
        == PackageManager.PERMISSION_GRANTED);
    } catch (Exception e) {
      promise.reject("CHECK_PERMISSION_ERROR", e);
    }
  }

  @ReactMethod
  public void scan(final Promise promise) {
    if (ContextCompat.checkSelfPermission(reactContext, getAudioPermission())
      != PackageManager.PERMISSION_GRANTED) {
      promise.reject("NO_PERMISSION", "no permission to read audio files");
      return;
    }

    new Thread(() -> {
      Cursor cursor = null;
      try {
        Uri uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
        String[] projection = new String[] {
          MediaStore.Audio.Media._ID,
          MediaStore.Audio.Media.TITLE,
          MediaStore.Audio.Media.ARTIST,
          MediaStore.Audio.Media.ALBUM,
          MediaStore.Audio.Media.ALBUM_ID,
          MediaStore.Audio.Media.DURATION,
          MediaStore.Audio.Media.SIZE,
          MediaStore.Audio.Media.DATA,
          MediaStore.Audio.Media.DATE_ADDED,
          MediaStore.Audio.Media.TRACK,
        };
        // IS_MUSIC != 0 用于排除铃声/通知音/录音，DURATION 过滤掉极短音频
        String selection = MediaStore.Audio.Media.IS_MUSIC + " != 0 AND "
          + MediaStore.Audio.Media.DURATION + " > " + MIN_DURATION;
        String sortOrder = MediaStore.Audio.Media.TITLE + " ASC";

        cursor = reactContext.getContentResolver().query(uri, projection, selection, null, sortOrder);
        WritableArray list = Arguments.createArray();
        if (cursor != null) {
          int idCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID);
          int titleCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE);
          int artistCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST);
          int albumCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM);
          int albumIdCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID);
          int durationCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION);
          int sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE);
          int dataCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA);
          int dateAddedCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATE_ADDED);
          int trackCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TRACK);

          while (cursor.moveToNext()) {
            String path = cursor.getString(dataCol);
            if (path == null || path.isEmpty()) continue;

            WritableMap item = Arguments.createMap();
            long id = cursor.getLong(idCol);
            item.putDouble("id", id);
            item.putString("title", cursor.getString(titleCol));
            item.putString("artist", cursor.getString(artistCol));
            item.putString("album", cursor.getString(albumCol));
            item.putDouble("albumId", cursor.getLong(albumIdCol));
            // 毫秒
            item.putDouble("duration", cursor.getLong(durationCol));
            item.putDouble("size", cursor.getLong(sizeCol));
            item.putString("path", path);
            item.putDouble("dateAdded", cursor.getLong(dateAddedCol));
            item.putInt("track", cursor.getInt(trackCol));
            item.putString("uri", Uri.withAppendedPath(
              MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, String.valueOf(id)).toString());
            list.pushMap(item);
          }
        }
        promise.resolve(list);
      } catch (Exception e) {
        Log.e(TAG, "scan music failed", e);
        promise.reject("SCAN_ERROR", e);
      } finally {
        if (cursor != null) cursor.close();
      }
    }).start();
  }
}
